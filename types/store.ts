import { VuexActionsTree } from "./actions";
import { VuexGetters, VuexGettersTree } from "./getters";
import { GlobalVuexModule, VuexModulesTree } from "./modules";
import { VuexCommitOptions, VuexCommit as VuexCommit, VuexMutations, VuexMutationsTree } from "./mutations";
import { VuexState } from "./state";

export type VuexPlugin<TStore extends VuexStoreDefinition> = (store: TStore) => any;

export type VuexStoreDefinition<
  TState extends {} = {},
  TMutations extends VuexMutationsTree = VuexMutationsTree,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexGettersTree = VuexGettersTree,
  TModules extends VuexModulesTree = VuexModulesTree,
> = Omit<GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>, "namespaced">
  & {
    strict?: boolean,
    devtools?: boolean,
    plugins?: VuexPlugin<VuexStoreDefinition<TState, TMutations, TActions, TGetters, TModules>>[]
  }
  ;

export type VuexStore<TDefinition extends VuexStoreDefinition> 
  = {
    commit: VuexCommit<TDefinition>;
    getters: VuexGetters<TDefinition>;

    replaceState(state: VuexState<TDefinition>): void;
  }
  ;

export declare function createStore<TDefinition extends VuexStoreDefinition>(definition: TDefinition): VuexStore<TDefinition>;