import { FormElementsType } from "./form-validation-type";

export interface PaginatedResponseType {
  total: number;
}

export type FormType = {
  _id: string;
  isActive: boolean;
  name: string;
  attributes: FormElementsType[];
  user: string;
  createdAt: string;
  updatedAt: string;
};
