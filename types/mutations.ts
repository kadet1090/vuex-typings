import { AddPrefix, UnionToIntersection } from "./helpers";
import { NamespacedVuexModule, VuexModule, VuexModulesTree } from "./modules";
import { VuexStore } from "./store";

export type VuexMutationHandler<TState, TPayload = never, TStore extends VuexStore<any> = never> 
  = [TPayload] extends [never] 
  ? (this: TStore, state: TState) => void
  : (this: TStore, state: TState, payload: TPayload) => void

export type VuexMutationsTree 
  = { [name: string]: VuexMutationHandler<any, any>; }

export type VuexMutationHandlerPayload<TMutation extends VuexMutationHandler<any, any>> 
  = Parameters<TMutation>[1] extends undefined 
  ? never 
  : Parameters<TMutation>[1]

export interface VuexCommitOptions {
  silent?: boolean;
  root?: boolean;
}

type VuexArgumentStyleCommitCallable<TMutation, TPayload> 
  = [TPayload] extends [never] 
  ? (mutation: TMutation, payload?: undefined, options?: VuexCommitOptions) => void 
  : (mutation: TMutation, payload: TPayload, options?: VuexCommitOptions) => void

export type VuexArgumentStyleCommit<TModule extends VuexModule, TPrefix extends string = never> 
  = VuexArgumentStyleCommitOwn<TModule, TPrefix>
  & VuexArgumentStyleCommitModules<TModule["modules"], TPrefix>

export type VuexArgumentStyleCommitOwn<TModule extends VuexModule, TPrefix extends string = never> 
  = UnionToIntersection<{ 
    [TMutation in keyof TModule["mutations"]]: VuexArgumentStyleCommitCallable<
      AddPrefix<string & TMutation, TPrefix>,
      VuexMutationHandlerPayload<TModule["mutations"][TMutation]>
    >;
  }[keyof TModule["mutations"]]>
  
export type VuexObjectStyleCommit<TModule extends VuexModule, TPrefix extends string = never>
  = ((mutation: VuexMutations<TModule, TPrefix>, options?: VuexCommitOptions) => void)

export type VuexCommit<TModule extends VuexModule, TPrefix extends string = never> 
  = VuexArgumentStyleCommitOwn<TModule, TPrefix>
  & VuexArgumentStyleCommitModules<TModule["modules"], TPrefix>
  & VuexObjectStyleCommit<TModule, TPrefix>

export type VuexArgumentStyleCommitModules<TModules extends VuexModulesTree, TPrefix extends string = never> 
  = UnionToIntersection<{ 
    [TKey in keyof TModules]: 
      VuexArgumentStyleCommit<
        TModules[TKey], 
        AddPrefix<TModules[TKey] extends NamespacedVuexModule ? (string & TKey) : never, TPrefix>
      > 
  }[keyof TModules]>

// Mutations
export type VuexMutation<TName extends string, TPayload = never> 
  = { type: TName } 
  & ([TPayload] extends [never] ? { } : { payload: TPayload })

export type VuexMutations<TModule extends VuexModule, TPrefix extends string = never>
  = VuexOwnMutations<TModule, TPrefix>
  | VuexModulesMutations<TModule["modules"], TPrefix>;

export type VuexOwnMutations<TModule extends VuexModule, TPrefix extends string = never>
  = { 
    [TMutation in keyof TModule["mutations"]]: VuexMutation<
      AddPrefix<string & TMutation, TPrefix>,
      VuexMutationHandlerPayload<TModule["mutations"][TMutation]>
    >
  }[keyof TModule["mutations"]]

export type VuexModulesMutations<TModules extends VuexModulesTree, TPrefix extends string = never>
  = { 
    [TModule in keyof TModules]:
      VuexMutations<
        TModules[TModule], 
        AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
      > 
  }[keyof TModules]