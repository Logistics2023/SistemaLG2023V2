import dynamic from "next/dynamic";
import { useEffect, useState } from "react"
import style from "../styles/StylesPDF.module.css"



const InvoicePDF = dynamic(() => import("../components/pdfTester"), {
    ssr: false,
  });

const View = () => {

    return(
        <div className={style.style}>
                    <InvoicePDF />
        </div>
    )
}


export default View








// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react"
// import style from "../styles/StylesPDF.module.css"



// const InvoicePDF = dynamic(() => import("../components/pdf"), {
//     ssr: false,
//   });

// const PdfView = () => {

  

//     return(
//         <div className={style.style}>
//                     <InvoicePDF />
//         </div>
//     )
// }

// export default PdfView











