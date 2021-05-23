import { GlobalVuexModule, VuexModulesTree } from "./modules";
import { VuexCommitOptions, VuexModuleCommit, VuexMutations, VuexMutationsTree } from "./mutations";
import { VuexState } from "./state";

export type VuexStoreDefinition<
  TState extends {},
  TMutations extends VuexMutationsTree, 
  TModules extends VuexModulesTree
> = Omit<GlobalVuexModule<TState, TMutations, TModules>, "namespaced">
  & {
    strict?: boolean,
    devtools?: boolean,
  }
  ;

export type VuexStore<TDefinition extends VuexStoreDefinition<any, any, any>> 
  = {
    commit: VuexModuleCommit<TDefinition> & ((mutation: VuexMutations<TDefinition>, options?: VuexCommitOptions) => void);
    replaceState(state: VuexState<TDefinition>): void;
  }
  ;

export declare function createStore<TDefinition extends VuexStoreDefinition<any, any, any>>(definition: TDefinition): VuexStore<TDefinition>;