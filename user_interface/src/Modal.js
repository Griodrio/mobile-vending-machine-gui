import React, {useState} from 'react'
import styled from 'styled-components'
import {MdClose} from 'react-icons/md'
import logo from './images/pic1.svg';
import ins1 from './images/Ins1.png'
import ins2 from './images/Ins2setengah.png'


const CloseModalButton = styled(MdClose)`
cursor: pointer;
position: absolute;
top: 170px;
right: 280px;
width: 32px;
height: 32px;
padding: 0;
z-index: 10;
`
const CloseModalButton2 = styled(MdClose)`
cursor: pointer;
position: absolute;
top: 25px;
left: 660px;
width: 32px;
height: 32px;
padding: 0;
z-index: 10;
`

export const Modal = ({showModal, setShowModal,openMidtrans,selectedBeverage,Tunai,
    showNextMoney, setNextMoney, showTooMuch, setTooMuch, showUangPas, setUangPas,
    showTolak, setTolak, loading, setLoading}) => {
    const onClickNonTunai = () => {
        openMidtrans(selectedBeverage)
    }

    const [showInstruksi, setShowInstruksi] = useState(false)
    const [showInstruksi2, setShowInstruksi2] = useState(false)
    const [showInstruksi3, setShowInstruksi3] = useState(false)

    const [harga2, setHarga2] = useState([])

    const onClickIns2= () => {
        setShowInstruksi(prev => !prev)
        setShowInstruksi2(prev => !prev)
    }

    const onClickIns3= () => {
        setShowInstruksi2(prev => !prev)
        setShowInstruksi3(prev => !prev)
    }

    const onClickIns = () => {
        console.log(selectedBeverage)

        if(selectedBeverage === 'Teh'){
            setHarga2([
                "satu lembar Rp10.000",
                "dua lembar Rp5.000 bergantian",
                "lima lembar Rp2.000 bergantian"
            ])
        }
        else if(selectedBeverage === 'Kopi'){
            setHarga2([
                "satu lembar Rp5.000",
                "dua lembar Rp2.000 dan satu lembar Rp1.000 bergantian"
            ])
        }
        else if(selectedBeverage === 'Soda'){
            setHarga2([
                "satu lembar Rp5.000 dan Rp2.000 bergantian"
            ])
        }
        else if(selectedBeverage === 'Sirup'){
            setHarga2([
                "dua lembar Rp2.000 bergantian"
            ])
        }
        setShowInstruksi(prev => !prev)
        
    }

    const onClickTunai = () => {
        Tunai(selectedBeverage)
    }
    

    return(
        <>
        
        {showModal ? (
            <div id="myModal" class="modal">
                <div class="column">
                    <button class="button-pushable" role="button" id="cash" onClick={onClickIns}>
                        <span class="button-shadow"></span>
                        <span class="button-edge"></span>
                        <span class="button-front text">
                            Tunai
                        </span>
                    </button>
                    <button class="button-pushable" role="button" id="cashless" onClick={onClickNonTunai}>
                        <span class="button-shadow"></span>
                        <span class="button-edge"></span>
                        <span class="button-front text">
                            Non-Tunai
                        </span>
                    </button>
                </div>                                                      
                <CloseModalButton aria-label='Close modal' onClick={() => {setShowModal(prev => !prev)}}/>
            </div>
            
            ) : null
        }
        {showInstruksi && (
            <div id="Ins" class="Instruction">
                <div class="InsColumn1">
                    <img alt="panda" className="Moneh1photo" src={ins1} />
                    <div class="moneh1asda">
                        <h1>Pastikan ujung uang tidak terlipat</h1>
                        <button class="moneh1_btn" id="btn" onClick={onClickIns2}><p>Selanjutnya</p></button>
                    </div>
                    <CloseModalButton2 aria-label='Close modal' onClick={() => setShowInstruksi(false) }/>    
                </div>
            </div>
            )
        }
        {showInstruksi2 && (
            <div id="Ins" class="Instruction">
                <div class="InsColumn2">
                    <img alt="panda" className="Moneh2photo" src={ins2} />
                    <div class="moneh2asda">
                        <h1>Jika uang tertolak coba untuk balik uang</h1>
                        <button class="moneh2_btn" id="btn" onClick={onClickIns3}><p>Selanjutnya</p></button>
                    </div>
                    <CloseModalButton2 aria-label='Close modal' onClick={() => [setShowInstruksi2(false),] }/>
                    
                </div>
            </div>
            )
        }
        {showInstruksi3 && (
            <div id="Ins" class="Instruction">
                <div class="InsColumn">
                    <img alt="panda" className="Insphoto" src={logo} />
                    <div class="asda">
                        <h1>Pilih salah satu cara:</h1>
                        <ol>
                            {harga2.map(item=>{
                                return <li>Masukkan {item}</li>
                            })}
                        </ol>
                        <h1>Setelah memasukkan uang tekan tombol</h1>
                        <button class="Ins_btn" id="btn" onClick={onClickTunai}><p>Ok</p></button>
                    </div>
                    <CloseModalButton2 aria-label='Close modal' onClick={() => setShowInstruksi3(prev => !prev) }/>
                    
                </div>
            </div>
            )
        }
        {showNextMoney && (
            <div class="bagg">
                <div class="Next">
                    <h1>Uang Kurang, Masukkan lagi lalu tekan ok</h1>
                    <button class="Ins_btn" id="btn" onClick={onClickTunai}><p>Ok</p></button>
                </div>
            </div>
        )}
        {showTooMuch && (
        <div class="bagg">
            <div class="TooMuch">
                <h1>Uang Berlebih, masukkan uang yang lain</h1>
                <button class="Ins_btn" id="btn" onClick={onClickTunai}><p>Coba Lagi</p></button>
            </div>
        </div>
        )}
        {showUangPas && (
        <div class="bagg">
            
            <div class="Pas">
            <h1>Uang diterima, Pesananmu sedang diproses</h1>
            </div>
        </div>
        )}
        {showTolak && (
        <div class="bagg">
            <div class="TooMuch">
            <h1>Uang ditolak, masukkan uang yang lain</h1>
            <button class="Ins_btn" id="btn" onClick={onClickTunai}><p>Coba Lagi</p></button>
            </div>
        </div>
        )}
        {!loading && 
            <div class="bagg">
                <div className={`cup ${loading ? "Unavailable" : ""}`}></div>
            </div>
        }
        
        
        </>
    )
}