import { VuexActionsTree } from "./actions";
import { VuexGettersTree } from "./getters";
import { VuexMutationsTree } from "./mutations";

export type BaseVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree = VuexMutationsTree,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexActionsTree = VuexGettersTree,
  TModules extends VuexModulesTree = {},
> = {
    state: TState;
    mutations: TMutations;
    modules: TModules;
    actions: TActions;
    getters: TGetters;
  }

export type NamespacedVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree = VuexMutationsTree,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexActionsTree = VuexGettersTree,
  TModules extends VuexModulesTree = {},
> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> & { namespace: true }

export type GlobalVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree = VuexMutationsTree,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexActionsTree = VuexGettersTree,
  TModules extends VuexModulesTree = {},
> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> & { namespace?: false };

export type VuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree = VuexMutationsTree,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexActionsTree = VuexGettersTree,
  TModules extends VuexModulesTree = {},
> = GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>
  | NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>

export type VuexModulesTree 
  = { [name: string]: VuexModule }