import { VuexMutationsTree } from "./mutations";

export type VuexModule<
  TNamespaced extends boolean,
  TState extends {},
  TMutations extends VuexMutationsTree, 
  TModules extends VuexModulesTree
> = {
    state: TState;
    mutations: TMutations;
    modules: TModules;
  } & (
    TNamespaced extends true
    ? { namespaced: true } 
    : { namespaced?: false }
  );

export type VuexModulesTree 
  = { 
    [name: string]: VuexModule<any, any, any, any> 
  }
  ;

export type NamespacedVuexModule<
  TState extends {},
  TMutations extends VuexMutationsTree, 
  TModules extends VuexModulesTree
> = VuexModule<true, TState, TMutations, TModules>
  ;

export type GlobalVuexModule<
  TState extends {},
  TMutations extends VuexMutationsTree, 
  TModules extends VuexModulesTree
> = VuexModule<false, TState, TMutations, TModules>
  ;

