import { VuexActionsTree } from "./actions";
import { VuexGettersTree } from "./getters";
import { UndefinedToOptional } from "./helpers";
import { VuexMutationsTree } from "./mutations";
import { VuexStateProvider } from "./state";

export type BaseVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree = VuexActionsTree | undefined,
  TGetters extends VuexGettersTree = VuexGettersTree | undefined,
  TModules extends VuexModulesTree = {} | undefined,
> = UndefinedToOptional<{
    state: VuexStateProvider<TState>;
    mutations: TMutations;
    modules: TModules;
    actions: TActions;
    getters: TGetters;
  }>

export type NamespacedVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree<NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>> = {} | undefined,
  TGetters extends VuexGettersTree = {} | undefined,
  TModules extends VuexModulesTree = {} | undefined,
> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> 
  & { namespaced: true }

export type GlobalVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree<GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>> = {} | undefined,
  TGetters extends VuexGettersTree = {} | undefined,
  TModules extends VuexModulesTree = {} | undefined,
> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> 
  & { namespaced?: false }

export type VuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexGettersTree = VuexGettersTree,
  TModules extends VuexModulesTree = {},
> = GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>
  | NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>

export type VuexModulesTree 
  = { [name: string]: VuexModule }