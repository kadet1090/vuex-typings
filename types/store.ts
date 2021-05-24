import { VuexActions, VuexActionsTree, VuexDispatch } from "./actions";
import { VuexGetter, VuexGetters, VuexGettersTree } from "./getters";
import { GlobalVuexModule, VuexModulesTree } from "./modules";
import { VuexCommitOptions, VuexCommit as VuexCommit, VuexMutations, VuexMutationsTree, VuexArgumentStyleCommit, VuexObjectStyleCommit } from "./mutations";
import { VuexState } from "./state";

export type VuexPlugin<TStore extends VuexStoreDefinition> 
  = (store: TStore) => any;

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

export type VuexWatchOptions 
  = any; // should import WatchOptions from vue

export type VuexSubscribeOptions 
  = {
    prepend?: boolean
  }

export type VuexMutationSubscriber<TDefinition extends VuexStoreDefinition>
  = (mutation: VuexMutations<TDefinition>) => any

export type VuexActionSubscriber<TDefinition extends VuexStoreDefinition>
  = VuexActionSubscriberCallback<TDefinition>
  | VuexActionSubscriberObject<TDefinition>

export type VuexActionSubscriberCallback<TDefinition extends VuexStoreDefinition>
  = (action: VuexActions<TDefinition>, state: VuexState<TDefinition>) => any
  
export type VuexActionErrorSubscriberCallback<TDefinition extends VuexStoreDefinition>
  = (action: VuexActions<TDefinition>, state: VuexState<TDefinition>, error: Error) => any

export type VuexActionSubscriberObject<TDefinition extends VuexStoreDefinition>
  = {
    before?: VuexActionSubscriberCallback<TDefinition>
    after?: VuexActionSubscriberCallback<TDefinition>
    error?: VuexActionErrorSubscriberCallback<TDefinition>
  }

export type VuexUnsubscribeFunction = () => void

export type VuexStore<TDefinition extends VuexStoreDefinition> 
  = {
    constructor(definition: TDefinition);

    commit: VuexArgumentStyleCommit<TDefinition> & VuexObjectStyleCommit<TDefinition>;
    dispatch: VuexDispatch<TDefinition>;
    getters: VuexGetters<TDefinition>;

    replaceState(state: VuexState<TDefinition>): void;

    hotUpdate(options: {
      actions?: VuexActionsTree,
      mutations?: VuexMutationsTree,
      getters?: VuexGettersTree,
      modules?: VuexModulesTree,
    }): void

    watch<T>(
      getter: VuexGetter<TDefinition, T>, 
      callback: (value: T, oldValue: T) => void, 
      options?: VuexWatchOptions
    ): VuexUnsubscribeFunction

    subscribe(
      mutation: VuexMutationSubscriber<TDefinition>,
      options?: VuexSubscribeOptions
    ): VuexUnsubscribeFunction

    subscribeAction(
      mutation: VuexActionSubscriber<TDefinition>,
      options?: VuexSubscribeOptions
    ): VuexUnsubscribeFunction
  }

export declare function createStore<TDefinition extends VuexStoreDefinition>(definition: TDefinition): VuexStore<TDefinition>;