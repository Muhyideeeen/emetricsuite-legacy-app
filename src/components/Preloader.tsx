import PreloaderGif from "../assets/images/preloader.gif"


const Preloader =()=>{



    return (
        <div style={
            { position: "fixed",
                top: "50%",
                left: "50%",
                /* bring your own prefixes */
                transform: "translate(-50%, -50%)",
                'zIndex':9000//it must rank the hiegest
            }
        }>

            <img
            // style={{ width:"100%","height":"100%"}}
            src={PreloaderGif} alt="Loading..." />
        </div>
    )
}

export default Preloader