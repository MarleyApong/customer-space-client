import React, { useEffect, useState } from 'react'
import * as RemixIcons from "react-icons/ri"
import './note.scss'
import StepItem from './StepItem'
import { useNavigate, useParams } from 'react-router-dom'
import { Company } from '../../../services/companyService'
import { Answer } from '../../../services/answersService'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'
import { Customer } from '../../../services/customerService'

const Note = () => {
    const [data, setData] = useState([])
    const [questions, setQuestions] = useState([])
    const [responses, setResponses] = useState([])
    const [step, setStep] = useState(0)
    const [send, setSend] = useState(false)
    const [stateMsg, setStateMsg] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const { company } = useParams()
    const Navigate = useNavigate()
    const currentHour = new Date().getHours()
    const isDaytime = currentHour >= 6 && currentHour < 18
    const idCustomer = uuid()

    const increment = () => {
        if (step < 5) {
            setStep((current) => current + 1)
            setStateMsg(false)
        }
    }

    const decrement = () => {
        setStep((current) => current - 1)
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await Company.getWebpage(company)
                setData(res.data.content)
                setQuestions(res.data.content.surveys[0].Questions)
                setResponses(res.data.content.surveys[0].Questions.map(() => ({ idQuestion: '', note: 0, suggestion: '', idCustomer: idCustomer })))
            }
            catch (err) {
                // console.log('err', err);
                // Navigate(-1)
            }
        }

        loadData()
    }, [company])

    const handleStarClick = (index, note, idQuestion) => {
        // setSelectedStars(note)
        setResponses((prevQuestions) => {
            const updatedQuestions = [...prevQuestions]
            updatedQuestions[index] = { ...updatedQuestions[index], note: note, idQuestion: idQuestion };
            return updatedQuestions
        })
    }

    const handleSuggestionChange = (index, suggestion) => {
        setResponses((prevResponses) => {
            const updatedResponses = [...prevResponses]
            updatedResponses[index] = { ...updatedResponses[index], suggestion: suggestion }
            return updatedResponses
        })
    }

    const handleSubmitNote = (e) => {
        e.preventDefault()
        toast.promise(
            Answer.add(responses)
                .then((res) => {
                    setSend(true)
                }),
            {
                loading: 'Envoi en cours...',
                success: <span>Vos réponses ont été envoyées !</span>,
                error: <span>Envoi échouée !</span>,
            }
        )

    }
    const idCustomer2 = responses.length > 0 ? responses[0].idCustomer : null

    const handleSubmitInfo = (e) => {
        e.preventDefault()
        const data = {
            name: name,
            phone: phone
        }

        toast.promise(
            Customer.update(idCustomer2, data)
                .then((res) => {
                    setSend(false)
                }),
            {
                loading: 'Envoi en cours...',
                success: <span>Cher {name}, nous vous remercions pour votre soutien !</span>,
                error: <span>Envoi échouée !</span>,
            }
        )
    }

    return (
        <div className='note'>
            {/* <header>
                <div className="log">
                    <img src={logo} alt="" />
                    <span>CUSTOMER SPACE</span>
                </div>
                <span className='hi'>Hi, customer !</span>
            </header> */}
            {Object.keys(data).length > 0 && data.surveys[0].Questions.length === 5 ?
                <main>
                    <div className="Survey">
                        <div><button className='Btn Error' onClick={() => Navigate(-1)}><RemixIcons.RiArrowLeftLine />Retour</button></div>
                        <div className="Head shadow">
                            <h4>Cher client, {isDaytime ? 'Bonjour' : 'Bonsoir'} !</h4>
                            <p> Vous êtes sur la page d'enquête de {data.name && data.name}</p>
                        </div>
                        {
                            send === false ?
                                <div className="First shadow">

                                    <form onSubmit={(e) => e.preventDefault()} className="Body">
                                        <div className="parent-name-survey">
                                            <span className="Name-Survey">Enquête du jour, {data.name && data.surveys[0].name.toUpperCase()}</span>
                                        </div>
                                        <p className='details'>Dans l'optique d'ameliorer la qualite de nos services et de toujours satisfaire, nous aimerions que vous nous notez, si possible laisser votre avis les questions ci-dessous :</p>
                                        <div className="Survey-Cont">
                                            {
                                                questions.map((q, index) => (
                                                    step === index ?
                                                        <div key={index} className="Quest-Content">
                                                            <div className="Question">
                                                                <div className='Question-num'>{index + 1}</div>
                                                                <div>{q.name}</div>
                                                            </div>
                                                            <small>Note: {responses[step].note}</small>
                                                            <div className="Star">
                                                                {Array.from({ length: 5 }, (_, i) => (
                                                                    <>
                                                                        {i < responses[step].note ? (
                                                                            <RemixIcons.RiStarFill
                                                                                onClick={() => handleStarClick(index, i + 1, questions[step].id)}
                                                                                className='active'
                                                                                size={21}
                                                                            />
                                                                        ) : (
                                                                            <RemixIcons.RiStarLine
                                                                                onClick={() => handleStarClick(step, i + 1, questions[step].id)}
                                                                                className={i < responses[step].note ? 'active' : ''}
                                                                                size={20}
                                                                            />
                                                                        )}
                                                                    </>
                                                                ))}
                                                                {stateMsg && responses.length > 0 && responses[step].note === 0 ?
                                                                    <small className='msg'><RemixIcons.RiArrowLeftFill /> notez ici pour continuer</small> : null
                                                                }
                                                            </div>
                                                            <textarea
                                                                name=""
                                                                id=""
                                                                cols="30"
                                                                rows="10"
                                                                placeholder='Votre avis sur la question'
                                                                value={q.suggestion}
                                                                onChange={(e) => handleSuggestionChange(index, e.target.value)}
                                                            ></textarea>
                                                        </div>
                                                        : null
                                                ))
                                            }
                                        </div>
                                        <div className="Nav-Step">
                                            {step > 0 ? (
                                                <button className='Btn Error' onClick={decrement}>
                                                    <RemixIcons.RiArrowDropLeftLine size={18} /> Précédent
                                                </button>
                                            ) : null}
                                            {step < 4 && responses.length > 0 && responses[step].note ? (
                                                <button className='Btn Error' onClick={increment}>
                                                    Suivant <RemixIcons.RiArrowDropRightLine size={18} />
                                                </button>
                                            ) : null}
                                            {responses.length > 0 && responses[step].note === 0 ? (
                                                <button className='Btn' onClick={() => setStateMsg(true)}>
                                                    Suivant
                                                </button>
                                            ) : null}
                                            {step === 4 && responses[step].note ? (
                                                <button type='submit' onClick={handleSubmitNote} className='Btn Send'>
                                                    Envoyer <RemixIcons.RiSendPlaneLine size={18} />
                                                </button>
                                            ) : null}
                                        </div>
                                    </form>
                                    <div className="Step-Cont">
                                        <StepItem index={0} step={step} />
                                        <StepItem index={1} step={step} />
                                        <StepItem index={2} step={step} />
                                        <StepItem index={3} step={step} />
                                        <StepItem index={4} step={step} />
                                    </div>
                                </div>
                                :
                                <div className="Second">
                                    <div className="part">
                                        <div className="Quest-Content">
                                            <h4>Aimeriez-vous, que nous vous contactons ?</h4>
                                            <form onSubmit={(e) => e.preventDefault()} className='Form-Subscribe'>
                                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Votre nom' />
                                                <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Votre numéro de téléphone' />
                                                <div className="Nav-Step">
                                                    <button onClick={() => window.location.reload()} className='Btn Error'>Non</button>
                                                    <button onClick={handleSubmitInfo} className='Btn Send'>Envoyer <RemixIcons.RiSendPlaneLine size={18} /></button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </main>
                : <div className='text-center'>
                    Aucune enquête disponible
                    <button className='Btn Error' onClick={() => Navigate(-1)}><RemixIcons.RiArrowLeftLine />Retour</button>
                </div>
            }
        </div >
    )
}

export default Note