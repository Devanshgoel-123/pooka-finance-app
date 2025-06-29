// import Image from "next/image"
// import { USDC_TOKEN } from "@/utils/constants"
// import "./styles.scss"
// import { useFetchParticularUserDeposit } from "@/hooks/useFetchUserDeposit"
// interface Props{
//     index:number
// }



// export const DepositRow=({
//     index
// }:Props)=>{
    
//     const {
//         userDeposit,
//         isFetching
//     }=useFetchParticularUserDeposit({
//         index
//     })

//     console.log("THe user depositefkmkdl", userDeposit)
//     if(userDeposit.amount===undefined || userDeposit.time===undefined) return null;
//     return ( null)
//     //     <div key={index} className="positionRowDeposit">

//     //   <div className="positionCell">
//     //     <div className="cellValue">
//     //         <Image src={USDC_TOKEN} height={28} width={28} alt="" className=""/>
//     //         {(Number(userDeposit.amount)/10**6).toFixed(3)}
//     //     </div>
//     //   </div>

//     //   <div className="positionCell">
//     //     <div className="cellValue">${new Date(userDeposit.time*1000).toISOString().split("T")[0]}</div>
//     //   </div>

//     //   </div>
// }