export interface SignUp {
  UserName: string;
  Email: string;
  Password: string;
}

export interface Login {
  UserName: string;
  Password: string;
}

export interface AccountDto {
  UserName: string;
  Email: string;
  Token?: string;
  Role: string;
}

export interface product {
  name: string,
  price: number,
  categoryId: string,
  categoryName: string,
  color: string,
  image: FormData,
  description: string,
  id: number,
  quantity: undefined | number,
  productId: undefined | number
}
export interface cart {
  name: string,
  price: number,
  categoryId: string,
  categoryName: string
  color: string,
  image: FormData,
  description: string,
  id: number | undefined,
  quantity: undefined | number,
  productId: number,
  userId: number
}
export interface category{
  id: number,
  name: string
}
export interface cartDto{
  quantity: undefined | number,
  productId: number,
  userId: number
}

export interface priceSummary {
  price: number,
  discount: number,
  tax: number,
  delivery: number,
  total: number
}

export interface order {
  email: string,
  address: string,
  contact: string,
  totalPrice: number,
  userId: string,
  id: number | undefined
}