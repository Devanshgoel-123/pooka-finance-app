/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TOAST_NAMES } from "@/store/types/types";
import { enqueueSnackbar } from "notistack";

export const useHandleToast=()=>{

    const handleToast=async(
    heading:string,
    subHeading:string,
    type:string,
    hash?:string,
    chain?:number
    )=>{
        enqueueSnackbar(heading,{
             variant: TOAST_NAMES.CUSTOM,
             //@ts-ignore
             type: type,
             subHeading: subHeading,
             hash: hash,
             chain: chain,
             anchorOrigin: {
               vertical: "top",
               horizontal: "right",
            }
        })
    }
    return {
        handleToast
    }
}