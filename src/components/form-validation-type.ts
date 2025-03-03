export interface FormElementsType {
    id: string;
    label: string;
    DataType: string;
    inputField:{label:string,name:string,placeholder:string,minlength:string,maxlength:string,className:string,value:string};
    isRequired: boolean;
    options?: { label: string; value: string }[];
  }
  