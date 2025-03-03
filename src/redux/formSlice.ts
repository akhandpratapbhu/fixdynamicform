import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormDataState {
  id: string;
  label: string;
  DataType: string;
  inputField:{label:string,name:string,placeholder:string,minlength:string,maxlength:string,className:string,value:string};
  isRequired: boolean;
  options?: { label: string; value: string }[];}

const initialState: FormDataState = {
  id:"",
  label: "",
  DataType: "",
  inputField:{label:"",name:'',placeholder:'',minlength:'',maxlength:'',className:'',value:''},
  isRequired: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<FormDataState>) => {
      console.log({...state,...action.payload});
      
      return { ...state, ...action.payload };
    },
  },
});

export const { setFormData } = formSlice.actions;
export default formSlice.reducer;
