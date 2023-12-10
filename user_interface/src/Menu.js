import axios from 'axios'
import React, {useState,useEffect} from 'react'
import { GlobalStyle } from './globalStyles'
import {Modal} from './Modal'
import { useNavigate } from "react-router-dom"

const URL = 'http://localhost:8000'

export default function Menu() {
    let Navigate = useNavigate();

    const [Available, setAvailable] = useState({
        teh: false,
        kopi: false,
        soda: false
    })
    

    const [showModal, setShowModal] = useState(false)

    const [showTolak, setTolak] = useState(false)

    const [showNextMoney, setNextMoney] = useState(false)

    const [showTooMuch, setTooMuch] = useState(false)

    const [showUangPas, setUangPas] = useState(false)

    // const [showInstruksi, setShowInstruksi] = useState(false)

    const [selectedBeverage, setSelectedBeverage] = useState(null)

    const [loading, setLoading] = useState(false)

    const openMidtrans = (nama_barang)=>{
        const param = {
            name: nama_barang,
            id: nama_barang,
            price: 0,
            quantity: 1
        }
        if(nama_barang === 'Teh'){
            param.price = 10000
        }
        else if(nama_barang === 'Kopi'){
            param.price = 5000
        }
        else if(nama_barang === 'Soda'){
            param.price = 7000
        }
        else if(nama_barang === 'Sirup'){
            param.price = 4000
        }
        else{
            alert(`Minuman ${nama_barang} Tidak Tersedia`)
            return
        }
        window.snap.show()
        axios.post(`${URL}/pay`,param)
            .then(response=>{
                console.log(response)
                window.snap.hide()
                window.snap.pay(response.data.token,{
                    onSuccess: function(result){
                        /* You may add your own implementation here */
                        console.log(result);
                        
                        axios.post(`${URL}/SendFlag`,{
                            product: nama_barang
                          })
                          .then(response=>{
                              alert('Sedang Diproses')
                              Navigate("/");
                          })
                          .catch(exception =>{
                              console.error(exception)
                          })
                      },
                      onError: function(result){
                        /* You may add your own implementation here */
                        alert("payment failed!"); console.log(result);
                        Navigate("/");
                      }
                })
            })
            .catch(exception => {
                console.error(exception)
                window.snap.hide()
            })
    }
    
    const Tunai = (nama_barang)=>{
        const param = {
            name: nama_barang,
            id: nama_barang,
            price: 0,
            quantity: 1
        }
        if(nama_barang === 'Teh'){
            param.price = 10000
        }
        else if(nama_barang === 'Kopi'){
            param.price = 5000
        }
        else if(nama_barang === 'Soda'){
            param.price = 7000
        }
        else if(nama_barang === 'Sirup'){
            param.price = 4000
        }
        else{
            alert(`Minuman ${nama_barang} Tidak Tersedia`)
            return
        }
        setLoading(false)
        axios.post(`${URL}/Tunai`,param)
            .then(response=>{
                setLoading(true)
                setNextMoney(false)
                setTolak(false)
                setTooMuch(false)
                console.log(response.data)
                if(response.status === 202){
                    if(response.data.Text ==='Lebih'){
                        setTooMuch(true)
                        console.log(response.data)
                    }
                    else if(response.data.Text ==='Kurang'){
                        setNextMoney(true)
                        console.log(response.data)
                        }
                    else{
                        setTolak(true)
                    }
                    
                }
                else if(response.status === 200){
                    setNextMoney(false)
                    setTolak(false)
                    setTooMuch(false)
                    setUangPas(true)
                    axios.post(`${URL}/SendFlag`,{
                        product: nama_barang
                      })
                    // cmd.product = nama_barang
                    // console.log(cmd.product)
                    // // axios.post(`${URL}/SendFlag`,cmd)
                    setTimeout(()=>Navigate("/"),3000)
                }
            })
            .catch(exception => {
                console.error({exception})
            })

    }

    // const openInstruct = () => {
    //     setShowInstruksi(prev => !prev)
    // }

    const openModal = (bev) =>{
        if(
            (bev === 'Teh'&&!Available.teh)||
            (bev === 'Kopi'&&!Available.kopi)||
            (bev === 'Soda'&&!Available.soda)||
            (bev === 'Sirup'&&!Available.water)
        )return

        setShowModal(prev => !prev)
        setSelectedBeverage(bev)
    }

    useEffect(()=>{
        axios.post(`${URL}/CheckAvailable`)
        .then(response=>{
            console.log(response.data)
            setAvailable(response.data)
            setLoading(true)
        })
        .catch(exception => {
            console.error(exception)
        })
    },[])

    return (
        <>
        <div>
            <nav className="navbar">
            <div className="navbar__container">
                <a href="/" id="navbar__logo"><i className="fab fa-maxcdn"></i>obile <div>&nbsp;</div><i className="fab fa-viacoin"></i>ending</a>
            </div>
            </nav>
        </div>
        
        <div className="Drinks" id = "myBtn">
            <div 
                className={`Drinks__box Drinks__box_teh ${Available.teh ? "" : "Unavailable"}`} 
                id="box1" 
                onClick={() => openModal("Teh")}
            >   
            
                <h1>Teh</h1>
                <h2>Rp10.000</h2>
            </div>
            <div 
                className={`Drinks__box Drinks__box_kopi ${Available.kopi ? "" : "Unavailable"}`}  
                id="box2" 
                onClick={() => openModal("Kopi")}
            >
                <h1>Kopi</h1>
                <h2>Rp5.000</h2>
            </div>
            <div 
                className={`Drinks__box Drinks__box_soda ${Available.soda ? "" : "Unavailable"}`} 
                id="box3" 
                onClick={() => openModal("Soda")}
            > 
                <h1>Soda</h1>
                <h2>Rp7.000</h2>
            </div>
            {/* <div className={`lds-hourglass ${loading ? "Unavailable" : ""}`}></div> */}
            <div className={`cup ${loading ? "Unavailable" : ""}`}></div>
            
            <div
                className={`Drinks__box Drinks__box_water ${Available.water ? "" : "Unavailable"}`} 
                id="box4"
                onClick={() => openModal("Sirup")}
            >
                <h1>Sirup</h1>
                <h2>Rp4.000</h2>
            </div>
            
            <Modal showModal={showModal} setShowModal={setShowModal} openMidtrans={openMidtrans} Tunai={Tunai} selectedBeverage={selectedBeverage} 
                showNextMoney={showNextMoney} setNextMoney={setNextMoney} showTooMuch={showTooMuch} setTooMuch={setTooMuch}
                showUangPas={showUangPas} setUangPas={setUangPas} showTolak={showTolak} setTolak={setTolak} loading={loading} setLoading={setLoading}/>
            <GlobalStyle />
        </div>
    </>
    )
}
