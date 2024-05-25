export interface signUp {
  userName: string;
  email: string;
  password: string;
  token?: string;
}
export interface login {
  username: string;
  password: String;
  token?: string;
}

export interface product {
  name: string,
  price: number,
  categoryId: string,
  categoryName: string
  color: string,
  image: string,
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
  image: string,
  description: string,
  id: number | undefined,
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