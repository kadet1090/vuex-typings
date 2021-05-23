import { AddPrefix, UnionToIntersection } from "./helpers";
import { NamespacedVuexModule, VuexModule, VuexModulesTree } from "./modules";
import { VuexStoreDefinition } from "./store";

export type VuexMutationHandler<TState, TPayload = never> 
  = [TPayload] extends [never] 
  ? (state: TState) => void
  : (state: TState, payload: TPayload) => void
  ;

export type VuexMutationsTree 
  = { [name: string]: VuexMutationHandler<any, any>; }
  ;

export type VuexMutationHandlerPayload<TMutation extends VuexMutationHandler<any, any>> 
  = Parameters<TMutation>[1] extends undefined 
  ? never 
  : Parameters<TMutation>[1]
  ;

export interface VuexCommitOptions {
  silent?: boolean;
  root?: boolean;
}

export type VuexArgumentStyleCommit<TMutation, TPayload> 
  = [TPayload] extends [never] 
  ? (mutation: TMutation, payload?: undefined, options?: VuexCommitOptions) => void 
  : (mutation: TMutation, payload: TPayload, options?: VuexCommitOptions) => void
  ;

export type VuexModuleOwnCommits<TModule extends VuexModule<any, any, any, any>, TPrefix extends string = never> 
  = UnionToIntersection<{ 
    [TMutation in keyof TModule["mutations"]]: VuexArgumentStyleCommit<
      AddPrefix<string & TMutation, TPrefix>,
      VuexMutationHandlerPayload<TModule["mutations"][TMutation]>
    >;
  }[keyof TModule["mutations"]]>
  ;

export type VuexModuleCommit<TModule extends VuexModule<any, any, any, any>, TPrefix extends string = never> 
  = VuexModuleOwnCommits<TModule, TPrefix>
  & VuexCommitOfModules<TModule["modules"], TPrefix>
  ;

export type VuexCommitByModule<TModules extends VuexModulesTree, TPrefix extends string = never> 
  = { 
    [TKey in keyof TModules]: 
      VuexModuleCommit<
        TModules[TKey], 
        AddPrefix<TModules[TKey] extends NamespacedVuexModule<any, any, any> ? (string & TKey) : never, TPrefix>
      > 
  }
  ;

export type VuexCommitOfModules<TModules extends VuexModulesTree, TPrefix extends string = never> 
  = UnionToIntersection<VuexCommitByModule<TModules, TPrefix>[keyof TModules]>
  ;

export type VuexMutation<TName extends string, TPayload = never> 
  = { type: TName } 
  & ([TPayload] extends [never] ? { } : { payload: TPayload })

export type VuexOwnMutations<TModule extends VuexModule<any, any, any, any>, TPrefix extends string = never>
  = { 
    [TMutation in keyof TModule["mutations"]]: VuexMutation<
      AddPrefix<string & TMutation, TPrefix>,
      VuexMutationHandlerPayload<TModule["mutations"][TMutation]>
    >
  }[keyof TModule["mutations"]]

export type VuexMutations<TModule extends VuexModule<any, any, any, any>, TPrefix extends string = never>
  = VuexOwnMutations<TModule, TPrefix>
  | { 
    [TSubModule in keyof TModule["modules"]]: 
      VuexMutations<
        TModule["modules"][TSubModule], 
        AddPrefix<TModule["modules"][TSubModule] extends NamespacedVuexModule<any, any, any> ? (string & TSubModule) : never, TPrefix>
      > 
  }[keyof TModule["modules"]];