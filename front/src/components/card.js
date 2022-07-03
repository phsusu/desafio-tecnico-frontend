import {useEffect, useState} from 'react'
import axios from 'axios'
import {MdDelete, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdEdit} from 'react-icons/md'

export function Cards({listaCabecalhos, listaChaves}){
    const [novoTitulo, setNovoTitulo] = useState('')
    const [novoConteudo, setNovoConteudo] = useState('')
    const [listaCards, setListaCards] = useState([])

    function listarCards(){
            axios.get('http://localhost:5000/cards/', 
            {
                headers: {
                    'Authorization': localStorage.getItem('authorization')
                }
            }
            ).then(res => {
                let lista = []
    
                res.data.forEach(v => {
                    if(!lista[v.lista]) lista[v.lista] = []
                    lista[v.lista].push(v)
                })
    
                setListaCards(lista)
            })
        }
    
    function criarCard(){
        axios.post('http://localhost:5000/cards/', {titulo: novoTitulo, conteudo: novoConteudo, lista: listaChaves[0]} , {
            headers: {
                'Authorization': localStorage.getItem('authorization')
            }
        }).then(() => {
            setNovoConteudo('')
            setNovoTitulo('')
        })
        listarCards()
    }

    function excluirCard(id){
        axios.delete(`http://localhost:5000/cards/${id}`,
        {headers: {'Authorization': localStorage.getItem('authorization')}})
        .then(res => {
            let lista = []
            res.data.forEach(v => {
                if(!lista[v.lista]) lista[v.lista] = []
                lista[v.lista].push(v)
            })
            setListaCards(lista)
        })
    }

    function alterarCard(id, novaPosicao, titulo, conteudo){
        axios.put(`http://localhost:5000/cards/${id}`,
        {id, lista: listaChaves[novaPosicao], titulo, conteudo},
        {headers: {'Authorization': localStorage.getItem('authorization')}})
        .then(listarCards)
    }
    useEffect(() => {
        listarCards()
    }, [])
    return (
        <ul id="kanban">
                <li>
                    <button id="btnCard" onClick={criarCard}>[+] Criar novo card</button>
                    <div id="criarCard">
                        <input placeholder='Título' value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} />
                        <textarea placeholder="Conteúdo" value={novoConteudo} onChange={e => setNovoConteudo(e.target.value)}></textarea>
                    </div>
                </li>
            
                {listaCabecalhos.map((v, k) => {
                    return (
                        <li key={k}>
                            <span>{v}</span>
                            {
                                listaCards?.[listaChaves?.[k]]?.map(v => {
                                    return (
                                        <div key={v.id} className="card">
                                            <div className="card-title">
                                                <label>{v.titulo}</label>
                                                <button><MdEdit /></button>
                                            </div>
                                            <div className='card-body'>
                                            <label>{v.conteudo}</label>
                                            </div>
                                            <div className='card-footer'>
                                                {k > 0 && <button onClick={e => alterarCard(v.id, k-1, v.titulo, v.conteudo)}><MdKeyboardArrowLeft /></button>}
                                                <button onClick={e => excluirCard(v.id)}><MdDelete /></button>
                                                {k < (listaChaves.length-1) && <button onClick={e => alterarCard(v.id, k+1, v.titulo, v.conteudo)}><MdKeyboardArrowRight /></button>}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </li>
                    )
                })
                }
                
            </ul>
        )
}