import React from 'react'
import logo from './images/pic1.svg';


export default function MainSection() {
    return (
        <>
        <div>
            <nav class="navbar">
            <div class="navbar__container">
                <a href="/" id="navbar__logo"><i class="fab fa-maxcdn"></i>obile <div>&nbsp;</div><i class="fab fa-viacoin"></i>ending</a>
            </div>
            </nav>
        </div>
        <div class="main">
            <div class="main__container">
                <div class="main__content">
                    <h1>WELCOME!</h1>
                    <h2>Freshen Your Day <i class="fas fa-heart"></i></h2>
                    <button class="main__btn" id="btn"><a href="/Menu">Pilih Minuman</a> </button>
                </div>
                <div class="main__img--container">
                    <img alt="panda" className="photo" src={logo} />
                </div>
            </div>
        </div>
        </>
    )
}
