import { VuexActionsTree, VuexDispatch } from "./actions";
import { VuexGetter, VuexGetters, VuexGettersTree } from "./getters";
import { GlobalVuexModule, VuexModulesTree } from "./modules";
import { VuexCommitOptions, VuexCommit as VuexCommit, VuexMutations, VuexMutationsTree, VuexArgumentStyleCommit, VuexObjectStyleCommit } from "./mutations";
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

export type VuexWatchOptions = any; // should import WatchOptions from vue

export type VuexStore<TDefinition extends VuexStoreDefinition> 
  = {
    constructor(definition: TDefinition);

    commit: VuexArgumentStyleCommit<TDefinition> & VuexObjectStyleCommit<TDefinition>;
    dispatch: VuexDispatch<TDefinition>;
    getters: VuexGetters<TDefinition>;

    replaceState(state: VuexState<TDefinition>): void;

    watch<T>(
      getter: VuexGetter<TDefinition, T>, 
      callback: (value: T, oldValue: T) => void, 
      options?: VuexWatchOptions
    ): () => void;
  }

export declare function createStore<TDefinition extends VuexStoreDefinition>(definition: TDefinition): VuexStore<TDefinition>;