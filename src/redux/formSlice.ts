import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormDataState {
  value: string;
  label: string;
  name: string;
  placeholder: string;
  minlength: string;
  maxlength: string;
  column: string;
}

const initialState: FormDataState = {
  label: "",
  name: "",
  placeholder: "",
  minlength: "",
  maxlength: "",
  column: "",
  value:""
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<FormDataState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFormData } = formSlice.actions;
export default formSlice.reducer;
