export type UnionToIntersection<T> 
  = (T extends any ? (x: T) => any : never) extends (x: infer R) => any 
  ? R 
  : never

export type AddPrefix<TValue extends string, TPrefix extends string = never> 
  = [TPrefix] extends [never] 
  ? TValue 
  : `${TPrefix}/${TValue}`

export type OptionalPropertyNames<T> 
  = {
    [K in keyof T]-?: undefined extends T[K] ? K : never;
  }[keyof T]

export type MakeOptional<TValue, TKeys extends keyof TValue>
  = { [TKey in TKeys]?: TValue[TKey] }

export type UndefinedToOptional<TValue extends {}>
  = Omit<TValue, OptionalPropertyNames<TValue>>
  & MakeOptional<TValue, OptionalPropertyNames<TValue>>

export type Partial<TValue> 
  = TValue extends {} 
  ? {
    [TKey in keyof TValue]?: Partial<TValue[TKey]>
  } 
  : TValue