// src/pages/HomePote.tsx
import React, { useEffect } from "react";
import "../styles/pote-home.css";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";


import LogoPote from "../assets/images/LogoPote.png";
import PoteWeb1 from "../assets/images/PoteWeb1.jpg";
import PoteWeb2 from "../assets/images/PoteWeb2.jpg";
import PoteWeb3 from "../assets/images/PoteWeb3.jpg";
import PoteWeb4 from "../assets/images/PoteWeb4.jpg";
import PoteWeb5 from "../assets/images/PoteWeb5.jpg";
import PoteWeb6 from "../assets/images/PoteWeb6.jpg";
import PoteWeb7 from "../assets/images/PoteWeb7.jpg";
import PoteWeb8 from "../assets/images/PoteWeb8.png";
import PoteWeb9 from "../assets/images/PoteWeb9.jpg";
import Stickers2 from "../assets/images/Stickers2.png";
import Stickers3 from "../assets/images/Stickers3.png";
import caralentes from "../assets/images/caralentes.png";

const HomePote: React.FC = () => {
  useEffect(() => {
    // Si querés que el botón "Hacé tu pedido" abra WhatsApp:
    // 1) descomentá el bloque
    // 2) cambiá número y mensaje.

    /*
    const WA_NUMBER = "5493874071979";
    const WA_MESSAGE = "Hola! Quiero hacer un pedido 🙂";

    const handler = (e: Event) => {
      e.preventDefault();
      window.open(
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`,
        "_blank"
      );
    };

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a.btn--blue, a.btn--lime")
    );

    links.forEach((a) => a.addEventListener("click", handler));

    return () => {
      links.forEach((a) => a.removeEventListener("click", handler));
    };
    */
  }, []);

  return (
    <div className="page">
      {/* =========================
        COMPONENT: TopBanner
        - Contiene Logo + NavButtons
        - Fondo: imagen grande
      ========================== */}
      <header className="top-banner" id="inicio">
        {/* REEMPLAZAR: imagen del banner superior */}
        <img
          className="top-banner__img"
          src={PoteWeb1}
          alt="Banner Pote (imagen de referencia)"
        />

        <div className="top-banner__inner">
          {/* COMPONENT: Logo */}
          {/* <a className="logo" href="#inicio" aria-label="Ir al inicio">
            <img
                className="top-logo"
                src={LogoPote}
                alt="LogoPote"
                />
            
          </a> */}

          {/* COMPONENT: NavButtons (usa Button component) */}
          <nav className="nav" aria-label="Navegación">
            <a className="logo" href="#inicio" aria-label="Ir al inicio">
            <img
                className="top-logo"
                src={LogoPote}
                alt="LogoPote"
                />
            
          </a>
          <div className="navright">
             
            <a className="btn btn--ghost btn--small" href="#inicio">
              Inicio
            </a>
            <a className="btn btn--lime btn--small" href="menu">
              Hacé tu pedido
            </a>
          </div>
          </nav>
        </div>
      </header>

      {/* =========================
        COMPONENT: HeroContent
        - Título grande + script rosa
        - CTA azul
        - Foto inclinada a la derecha
      ========================== */}
      <section className="hero" id="pedido">
        <div className="hero__grid">
          <div className="stack-12">
            <h1 className="hero__title">
              ALIMENTO PARA
              <br />
              LOS SENTIDOS
            </h1>

            <div className="hero__script">
              y listo
              <br />
              para vos!
            </div>

            <div className="hero__cta">
              {/* COMPONENT: Button */}
              <a className="btn btn--blue" href="menu">
                Hacé tu pedido
              </a>
            </div>
          </div>

          {/* COMPONENT: TiltPhotoCard */}
          <figure className="tilt-photo" aria-label="Foto destacada">
            {/* REEMPLAZAR: foto inclinada */}
            <img
src={PoteWeb2}              alt="Persona comiendo Pote (imagen de referencia)"
            />
          </figure>
        </div>
      </section>

      {/* =========================
        COMPONENT: ClaimsStrip
        - Franja verde flúo inferior con 3 claims
      ========================== */}
      <section className="claims" id="contacto" aria-label="Beneficios">
        <div className="claims__row">
          <div className="claim">INGREDIENTES FRESCOS</div>
          <img className="sticker-icon" src={Stickers2} alt="Sticker" /> 
          <div className="claim">COMIDA RICA Y SANA</div>
          <img className="sticker-icon" src={Stickers2} alt="Sticker" /> 
          <div className="claim">ARMALO A TU MANERA</div>
        </div>
      </section>

      {/* =========================
        SECTION: ChoosePoteBanner
        (va debajo de la sección anterior)
      ========================= */}
      <section className="choosePote" aria-label="Elegir POTE">
        <div className="choosePote__wrap">
          <div className="choosePote__card">
            {/* Fondo (reemplazar por tu imagen real) */}
            <img
              className="choosePote__bg"
src={PoteWeb3}              alt="Fondo del banner Elegir Pote"
            />

            {/* Overlay */}
            <div className="choosePote__overlay" aria-hidden="true"></div>

            {/* Contenido */}
            <div className="choosePote__content">
              <h2 className="choosePote__line1">ELEGIR</h2>

              <div className="choosePote__line2">
                PÓTE
                {/* Sticker (si luego tenés el PNG, lo cambiamos por <img>) */}
                {/* <span className="choosePote__sticker" aria-hidden="true">
                  <span>🤟</span>                  
          <img className="sticker-icon" src={Stickers2} alt="Sticker" /> 
                </span> */}
                
                <img className="choosePote-sticker-icon" src={Stickers2} alt="Sticker" />
              </div>

              <p className="choosePote__desc">
                es elegir energía, frescura
                <br />
                y buena vibra en tu rutina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
        SECTION: MissionBanner
        (va debajo de la sección anterior)
      ========================= */}
      <section className="missionB" aria-label="Nuestra misión">
        <div className="missionB__wrap">
          <div className="missionB__outer">
            <div className="missionB__card">
              {/* Fondo (reemplazar por tu imagen real) */}
              <img
                className="missionB__bg"
src={PoteWeb4}                alt="Fondo sección misión"
              />

              {/* Overlay */}
              <div className="missionB__overlay" aria-hidden="true"></div>

              {/* Contenido */}
              <div className="missionB__content">
                <h2 className="missionB__title">NUESTRA MISIÓN</h2>
                <div className="missionB__script">es simple.</div>

                <div className="missionB__note">
                  {/* Stickers (si luego tenés PNG/SVG, se reemplazan por <img>) */}
                  {/* <span
                    className="missionB__sticker missionB__sticker--left"
                    aria-hidden="true"
                  >
                    <span>🤟</span>
                  </span>
                  <span
                    className="missionB__sticker missionB__sticker--right"
                    aria-hidden="true"
                  >
                    <span>🖐️</span>
                  </span> */}
                  <img className="choosePote-sticker-icon missionB__sticker--left" src={Stickers2} alt="Sticker" /> 
                  <img className="choosePote-sticker-icon missionB__sticker--right" src={Stickers2} alt="Sticker" />


                  <p className="missionB__noteText">
                    QUE TE ALIMENTES BIEN,
                    <br />
                    QUE DISFRUTES EL SABOR,
                    <br />
                    QUE NO PIERDAS TIEMPO EN LA COCINA.
                  </p>
                </div>
              </div>
            </div>

            {/* Reutiliza tu componente de botones */}
            <div className="missionB__actions">
              <a className="btn btn--lime" href="menu">
                HACÉ TU PEDIDO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
        SECTION: ProductsGrid
        (va debajo de la sección anterior)
      ========================= */}
      <section className="pGrid" id="productos" aria-label="Nuestros productos">
        <div className="pGrid__wrap">
          {/* Header */}
          <header className="pGrid__head">
            <p className="pGrid__script">nuestros</p>

            <h2 className="pGrid__title">
              PRODUCTOS
              {/* <span className="pGrid__sticker" aria-hidden="true">
                <span>🤟</span>
              </span> */}
              
                  <img className="pGrid-sticker-icon  " src={Stickers2} alt="Sticker" />
            </h2>
          </header>

          {/* Grid */}
          <div className="pGrid__grid">
            {/* Card 1 */}
            <article className="pCard" aria-label="Ensaladas">
              <div className="pCard__sheet">
                <div className="pCard__tag">ENSALADAS</div>

                <div className="pCard__media">
                  <img
                    className="pCard__img"
                    src={PoteWeb5}
                    alt="Ensaladas"
                  />
                </div>

                <div className="pCard__tear" aria-hidden="true"></div>
              </div>

              {/* Reutiliza tu botón */}
              <a className="btn btn--lime pCard__btn" href="menu">
                HACÉ TU PEDIDO
              </a>
            </article>

            {/* Card 2 */}
            <article className="pCard" aria-label="Tartas">
              <div className="pCard__sheet">
                <div className="pCard__tag">TARTAS</div>

                <div className="pCard__media">
                  <img
                    className="pCard__img"
                    src={PoteWeb6}
                    alt="Tartas"
                  />
                </div>

                <div className="pCard__tear" aria-hidden="true"></div>
              </div>

              <a className="btn btn--lime pCard__btn" href="menu">
                HACÉ TU PEDIDO
              </a>
            </article>

            {/* Card 3 */}
            <article className="pCard" aria-label="Pastas">
              <div className="pCard__sheet">
                <div className="pCard__tag">PASTAS</div>

                <div className="pCard__media">
                  <img
                    className="pCard__img"
                    src={PoteWeb7}
                    alt="Pastas"
                  />
                </div>

                <div className="pCard__tear" aria-hidden="true"></div>
              </div>

              <a className="btn btn--lime pCard__btn" href="menu">
                HACÉ TU PEDIDO
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* =========================
        COMPONENT: ClaimsStrip (repetido en tu HTML original)
      ========================== */}
      <section className="claims" aria-label="Beneficios">
        <div className="claims__row">
          <div className="claim">INGREDIENTES FRESCOS</div>
          <img className="sticker-icon" src={Stickers2} alt="Sticker" /> 
          <div className="claim">COMIDA RICA Y SANA</div>
          <img className="sticker-icon" src={Stickers2} alt="Sticker" /> 
          <div className="claim">ARMALO A TU MANERA</div>
        </div>
      </section>

      {/* =========================
        SECTION: BuildPote
        (va debajo de la sección anterior)
      ========================= */}
      <section className="buildP" id="arma-tu-pote" aria-label="Armá tu pote">
        <div className="buildP__wrap">
          <div className="buildP__card">
            <div className="buildP__grid">
              {/* Texto */}
              <div className="buildP__flex">
                <h2 className="buildP__title">
                  <span className="buildP__titleTop">ARMA TU</span>

                  <div className="pote">
                    <span className="buildP__titleBottom">PÓTE</span>

                    {/* Stickers decorativos */}
                    {/* <span
                      className="buildP__sticker buildP__sticker--sun"
                      aria-hidden="true"
                    >
                      <span>😎</span>
                    </span>
                    <span
                      className="buildP__sticker buildP__sticker--hand"
                      aria-hidden="true"
                    >
                      <span>👌</span>
                    </span> */}
                    <img className="buildP-sticker-icon  buildP__sticker--sun" src={caralentes} alt="Sticker" />
                    <img className="buildP-sticker-icon  buildP__sticker--hand" src={Stickers2} alt="Sticker" />
                  </div>
                </h2>

                <p className="buildP__desc">
                  Elegí tus ingredientes y creá
                  <br />
                  tu combinación ideal.
                </p>

                <div className="buildP__actions">
                  {/* Reutiliza tu botón azul existente */}
                  <a className="btn btn--blue" href="menu">
                    HACÉ TU PEDIDO
                  </a>
                </div>
              </div>

              {/* Imagen producto */}
              <div className="buildP__media">
                {/* REEMPLAZAR por imagen real del pote */}
                <img
                  className="buildP__product"
                  src={PoteWeb8}
                  alt="Pote (producto)"
                />
                
                    <img className="salad-sticker-icon buildP__sticker--salad" src={Stickers3} alt="Sticker" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
        SECTION: SimpleEatBanner
      ========================= */}
      <section className="simpleEat" aria-label="Comer bien también puede ser simple">
        <div className="simpleEat__wrap">
          <div className="simpleEat__card">
            {/* Fondo (reemplazar por imagen real) */}
            <img
              className="simpleEat__bg"
              src={PoteWeb9}
              alt="Persona comiendo Pote"
            />

            <div className="simpleEat__overlay" aria-hidden="true"></div>

            <div className="simpleEat__content">
              <h2 className="simpleEat__title">
                <span className="simpleEat__titleMain">COMER BIEN</span>
                <span className="simpleEat__titleSub">TAMBIÉN PUEDE SER</span>
              </h2>

              <div className="simpleEat__simple">
                {/* <div className="simpleEat__sticker" aria-hidden="true">
                  <span>🤟</span>
                </div> */}
                <div className="simpleEat__script">simple</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
        SECTION: PoteFooter (última)
      ========================= */}
      <footer className="pFooter" id="contacto" aria-label="Contacto">
        <div className="pFooter__topLine" aria-hidden="true"></div>

        <div className="pFooter__wrap">
          {/* Marca */}
          <a className="pFooter__brand" href="#inicio" aria-label="Volver al inicio">
            {/* <div className="pFooter__brandText">PÓTE</div> */}
            <img
          className=" pFooter__logo"
          src={LogoPote}
          alt="Banner Pote (imagen de referencia)"
        />
          </a>
          

          {/* Contacto */}
          <div className="pFooter__info" aria-label="Datos de contacto">
            <div className="pFooter__item"> 
    <FaWhatsapp className="pFooter__icon" />
              <a
                className="pFooter__link"
                href="https://wa.me/5493874071979"
                target="_blank"
                rel="noreferrer"
              >
                +54 9 3874071979
              </a>
            </div>

            <div className="pFooter__item">
                <MdEmail className="pFooter__icon" />
              <a className="pFooter__link" href="mailto:potevaconvos@gmail.com">
                potevaconvos@gmail.com
              </a>
            </div>

            <div className="pFooter__item">
    <FaMapMarkerAlt className="pFooter__icon" />
              <span>Salta, Argentina</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePote;