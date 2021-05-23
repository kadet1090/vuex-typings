import { AddPrefix, UnionToIntersection } from "./helpers";
import { NamespacedVuexModule, VuexModule, VuexModulesTree } from "./modules";

export type VuexGettersTree
  = { [name: string]: VuexGetter<any, any>; }

export type VuexGetter<TState extends {}, TResult> 
  = (state: TState) => TResult

export type VuexOwnGetters<TModule extends VuexModule, TPrefix extends string = never>
  = { [TGetter in keyof TModule["getters"] as `${AddPrefix<string & TGetter, TPrefix>}`]: ReturnType<TModule["getters"][TGetter]> }

export type VuexModulesGetters<TModules extends VuexModulesTree, TPrefix extends string = never>
  = UnionToIntersection<{ 
    [TModule in keyof TModules]: VuexGetters<
      TModules[TModule], 
      AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
    > 
  }[keyof TModules]>

export type VuexGetters<TModule extends VuexModule<any, any, any, any>, TPrefix extends string = never>
  = VuexOwnGetters<TModule, TPrefix>
  & VuexModulesGetters<TModule["modules"], TPrefix>
  
export type VuexGetterResult<TModule extends VuexModule, TGetter extends keyof VuexGetters<TModule>>
  = VuexGetters<TModule>[TGetter]