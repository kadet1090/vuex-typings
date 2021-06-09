declare module "vuex" {
    import { WatchOptions } from "vue";

    export type VuexActionsTree<TModule extends VuexModule = any, TDefinition extends VuexStoreDefinition = any> = { [name: string]: VuexActionHandler<TModule, any, any, TDefinition>; };
    export type VuexActionHandler<TModule extends VuexModule, TPayload = never, TResult = Promise<void>, TDefinition extends VuexStoreDefinition = any> = (
          this: VuexStore<TDefinition>, 
          context: VuexActionContext<TModule, TDefinition>, 
          payload: TPayload
        ) => TResult;
    export type VuexActionHandlerPayload<TAction extends VuexActionHandler<any, any, any, any>> = Parameters<TAction>[1] extends undefined 
          ? never 
          : Parameters<TAction>[1];

    export interface VuexActionContext<TModule extends VuexModule, TRoot extends VuexModule<any, any, any, any, any> = VuexModule<any, any, any, any, any>> {
        commit: VuexCommit<TModule>;
        dispatch: VuexDispatch<TModule>;
        state: VuexState<TModule>;
        getters: VuexGetters<TModule>;
        rootState: VuexState<TRoot>;
        rootGetters: VuexGetters<TRoot>;
    }

    export type VuexAction<TName extends string, TPayload = never> = { type: TName } 
          & ([TPayload] extends [never] ? { } : UndefinedToOptional<{ payload: TPayload }>);
    export type VuexActions<TModule extends VuexModule, TPrefix extends string = never> = VuexOwnActions<TModule, TPrefix>
          | VuexModulesActions<TModule["modules"], TPrefix>;
    export type VuexOwnActions<TModule extends VuexModule, TPrefix extends string = never> = { 
            [TAction in keyof TModule["actions"]]: VuexAction<
              AddPrefix<string & TAction, TPrefix>,
              VuexActionHandlerPayload<TModule["actions"][TAction]>
            > 
          }[keyof TModule["actions"]];
    export type VuexModulesActions<TModules extends VuexModulesTree, TPrefix extends string = never> = { 
            [TModule in keyof TModules]: 
              VuexActions<
                TModules[TModule], 
                AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
              > 
          }[keyof TModules];
    type VuexArgumentStyleDispatchCallable<TAction, TPayload, TResult> = true extends IsRequired<TPayload>
          ? (action: TAction, payload: TPayload, options?: VuexDispatchOptions) => TResult
          : (action: TAction, payload?: TPayload, options?: VuexDispatchOptions) => TResult;

    export interface VuexDispatchOptions {
        root?: boolean;
    }

    export type VuexDispatch<TModule extends VuexModule, TPrefix extends string = never> = VuexObjectStyleDispatch<TModule, TPrefix>
          & VuexArgumentStyleDispatch<TModule, TPrefix>;
    export type VuexObjectStyleDispatch<TModule extends VuexModule, TPrefix extends string = never> = <TAction extends VuexActionTypes<TModule>>(
              action: VuexActionByName<TModule, TAction, TPrefix>, 
              options?: VuexDispatchOptions
            ) => VuexActionResult<TModule, TAction, TPrefix>;
    export type VuexArgumentStyleDispatch<TModule extends VuexModule, TPrefix extends string = never> = VuexArgumentStyleDispatchOwn<TModule, TPrefix>
          & VuexArgumentStyleDispatchModules<TModule["modules"], TPrefix>;
    export type VuexArgumentStyleDispatchOwn<TModule extends VuexModule, TPrefix extends string = never> = UnionToIntersection<{
            [TAction in keyof TModule["actions"]]: VuexArgumentStyleDispatchCallable<
              AddPrefix<string & TAction, TPrefix>,
              VuexActionHandlerPayload<TModule["actions"][TAction]>,
              ReturnType<TModule["actions"][TAction]>
            >
          }[keyof TModule["actions"]]>;
    export type VuexArgumentStyleDispatchByModules<TModules extends VuexModulesTree, TPrefix extends string = never> = (TModules extends never ? true : false) extends false
          ? OmitUndefinedKeys<{ 
            [TModule in keyof TModules]: 
              VuexArgumentStyleDispatch<
                TModules[TModule], 
                AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
              > 
          }>
          : never;
    export type VuexArgumentStyleDispatchModules<TModules extends VuexModulesTree, TPrefix extends string = never> = UnionToIntersection<VuexArgumentStyleDispatchByModules<TModules, TPrefix>[keyof VuexArgumentStyleDispatchByModules<TModules, TPrefix>]>;
    export type VuexActionTypes<TModule extends VuexModule, TPrefix extends string = never> = VuexOwnActionTypes<TModule, TPrefix>
          | VuexModulesActionTypes<TModule["modules"], TPrefix>;
    export type VuexOwnActionTypes<TModule extends VuexModule, TPrefix extends string = never> = AddPrefix<string & keyof TModule["actions"], TPrefix>;
    export type VuexModulesActionTypes<TModules extends VuexModulesTree, TPrefix extends string = never> = (TModules extends never ? true : false) extends false
          ? { 
            [TModule in keyof TModules]:
              VuexOwnActionTypes<
                TModules[TModule], 
                AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
              > 
          }[keyof TModules]
          : never;
    export type VuexActionByName<TModule extends VuexModule, TAction extends VuexActionTypes<TModule>, TPrefix extends string = never> = (TModule extends never ? true : false) extends false
          ? Extract<VuexActions<TModule, TPrefix>, VuexAction<TAction, any>>
          : VuexAction<string, any>;
    export type VuexActionPayload<TModule extends VuexModule, TMutation extends VuexActionTypes<TModule>, TPrefix extends string = never> = VuexActionByName<TModule, TMutation, TPrefix> extends VuexAction<TMutation, infer TPayload>
          ? TPayload
          : never;
    export type VuexActionResult<TModule extends VuexModule, TMutation extends VuexActionTypes<TModule>, TPrefix extends string = never> = ReturnType<Extract<VuexArgumentStyleDispatch<TModule, TPrefix>, (action: TMutation, ...args: any[]) => any>>;
    export type VuexMutationHandler<TState, TPayload = never, TDefinition extends VuexStoreDefinition = any> = [TPayload] extends [never] 
          ? (this: VuexStore<TDefinition>, state: TState) => void
          : (this: VuexStore<TDefinition>, state: TState, payload: TPayload) => void;
    export type VuexMutationsTree<TState = any, TDefinition extends VuexStoreDefinition = any> = { [name: string]: VuexMutationHandler<TState, any, TDefinition>; };
    export type VuexMutationHandlerPayload<TMutation extends VuexMutationHandler<any, any>> = Parameters<TMutation>[1] extends undefined 
          ? never 
          : Parameters<TMutation>[1];

    export interface VuexCommitOptions {
        silent?: boolean;
        root?: boolean;
    }

    type VuexArgumentStyleCommitCallable<TMutation, TPayload> = true extends IsRequired<TPayload>
          ? (mutation: TMutation, payload: TPayload, options?: VuexCommitOptions) => void
          : (mutation: TMutation, payload?: TPayload, options?: VuexCommitOptions) => void;
    export type VuexArgumentStyleCommit<TModule extends VuexModule, TPrefix extends string = never> = VuexArgumentStyleCommitOwn<TModule, TPrefix>
          & VuexArgumentStyleCommitModules<TModule["modules"], TPrefix>;
    export type VuexArgumentStyleCommitOwn<TModule extends VuexModule, TPrefix extends string = never> = UnionToIntersection<{ 
            [TMutation in keyof TModule["mutations"]]: VuexArgumentStyleCommitCallable<
              AddPrefix<string & TMutation, TPrefix>,
              VuexMutationHandlerPayload<TModule["mutations"][TMutation]>
            >;
          }[keyof TModule["mutations"]]>;
    export type VuexObjectStyleCommit<TModule extends VuexModule, TPrefix extends string = never> = (mutation: VuexMutations<TModule, TPrefix>, options?: VuexCommitOptions) => void;
    export type VuexCommit<TModule extends VuexModule, TPrefix extends string = never> = VuexArgumentStyleCommit<TModule, TPrefix>
          & VuexObjectStyleCommit<TModule, TPrefix>;
    export type VuexArgumentStyleCommitModules<TModules extends VuexModulesTree, TPrefix extends string = never> = (TModules extends never ? true : false) extends false
            ? UnionToIntersection<{ 
              [TKey in keyof TModules]: 
                VuexArgumentStyleCommit<
                  TModules[TKey], 
                  AddPrefix<TModules[TKey] extends NamespacedVuexModule ? (string & TKey) : never, TPrefix>
                > 
            }[keyof TModules]>
            : unknown;
    export type VuexMutation<TName extends string, TPayload = never> = { type: TName } 
          & ([TPayload] extends [never] ? { } : UndefinedToOptional<{ payload: TPayload }>);
    export type VuexMutations<TModule extends VuexModule, TPrefix extends string = never> = VuexOwnMutations<TModule, TPrefix>
          | VuexModulesMutations<TModule["modules"], TPrefix>;
    export type VuexOwnMutations<TModule extends VuexModule, TPrefix extends string = never> = { 
            [TMutation in keyof TModule["mutations"]]: VuexMutation<
              AddPrefix<string & TMutation, TPrefix>,
              VuexMutationHandlerPayload<TModule["mutations"][TMutation]>
            >
          }[keyof TModule["mutations"]];
    export type VuexModulesMutations<TModules extends VuexModulesTree, TPrefix extends string = never> = (TModules extends never ? true : false) extends false
          ? { 
            [TModule in keyof TModules]:
              VuexMutations<
                TModules[TModule], 
                AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
              > 
          }[keyof TModules]
          : never;
    export type VuexMutationTypes<TModule extends VuexModule, TPrefix extends string = never> = VuexOwnMutationTypes<TModule, TPrefix>
          | VuexModulesMutationTypes<TModule["modules"], TPrefix>;
    export type VuexOwnMutationTypes<TModule extends VuexModule, TPrefix extends string = never> = AddPrefix<string & keyof TModule["mutations"], TPrefix>;
    export type VuexModulesMutationTypes<TModules extends VuexModulesTree, TPrefix extends string = never> = { 
            [TModule in keyof TModules]:
              VuexOwnMutationTypes<
                TModules[TModule], 
                AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
              > 
          }[keyof TModules];
    export type VuexMutationByName<TModule extends VuexModule, TMutation extends VuexMutationTypes<TModule>, TPrefix extends string = never> = Extract<VuexMutations<TModule, TPrefix>, VuexMutation<TMutation, any>>;
    export type VuexMutationPayload<TModule extends VuexModule, TMutation extends VuexMutationTypes<TModule>, TPrefix extends string = never> = VuexMutationByName<TModule, TMutation, TPrefix> extends VuexMutation<TMutation, infer TPayload>
          ? TPayload
          : never;
    export type VuexGettersTree<TModule extends VuexModule = any> = { [name: string]: VuexGetter<TModule, any, any>; };
    export type VuexGetter<TModule extends VuexModule<any, any, any, any>, TResult, TGetters = VuexGetters<TModule>> = (state: VuexState<TModule>, getters: TGetters) => TResult;
    export type VuexOwnGetters<TModule extends VuexModule, TPrefix extends string = never> = { [TGetter in keyof TModule["getters"] as `${AddPrefix<string & TGetter, TPrefix>}`]: ReturnType<TModule["getters"][TGetter]> };
    export type VuexModulesGetters<TModules extends VuexModulesTree, TPrefix extends string = never> = (TModules extends never ? true : false) extends false
          ? UnionToIntersection<{ 
            [TModule in keyof TModules]: VuexGetters<
              TModules[TModule], 
              AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
            > 
          }[keyof TModules]>
          : unknown;
    export type VuexGetters<TModule extends VuexModule<any, any, any, any>, TPrefix extends string = never> = VuexOwnGetters<TModule, TPrefix>
          & VuexModulesGetters<TModule["modules"], TPrefix>;
    export type VuexGetterResult<TModule extends VuexModule, TGetter extends keyof VuexGetters<TModule>> = VuexGetters<TModule>[TGetter];
    export type VuexGettersNames<TModule extends VuexModule> = keyof VuexGetters<TModule>;
    export type VuexState<TModule extends VuexModule<any, any, any, any, any>> = VuexOwnState<TModule>
          & VuexModulesState<TModule["modules"]>;
    export type VuexOwnState<TModule extends VuexModule<any>> = VuexExtractState<TModule["state"]>;
    export type VuexModulesState<TModules extends VuexModulesTree> = { [TModule in keyof TModules]: VuexState<TModules[TModule]> };
    export type VuexStateProvider<TState> = TState
          | (() => TState);
    export type VuexExtractState<TState> = TState extends VuexStateProvider<infer TResult>
          ? TResult
          : unknown;
    export type BaseVuexModule<TState extends {} = {}, TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>, TActions extends VuexActionsTree = VuexActionsTree | undefined, TGetters extends VuexGettersTree = VuexGettersTree | undefined, TModules extends VuexModulesTree = {} | undefined> = UndefinedToOptional<{
            state: VuexStateProvider<TState>;
            mutations: TMutations;
            modules: TModules;
            actions: TActions;
            getters: TGetters;
          }>;
    export type NamespacedVuexModule<TState extends {} = {}, TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>, TActions extends VuexActionsTree<NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>> = {} | undefined, TGetters extends VuexGettersTree = {} | undefined, TModules extends VuexModulesTree = {} | undefined> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> 
          & { namespaced: true };
    export type GlobalVuexModule<TState extends {} = {}, TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>, TActions extends VuexActionsTree<GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>> = {} | undefined, TGetters extends VuexGettersTree = {} | undefined, TModules extends VuexModulesTree = {} | undefined> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> 
          & { namespaced?: false };
    export type VuexModule<TState extends {} = {}, TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>, TActions extends VuexActionsTree = VuexActionsTree, TGetters extends VuexGettersTree = VuexGettersTree, TModules extends VuexModulesTree = {}> = GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>
          | NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>;
    export type VuexModulesTree = { [name: string]: VuexModule<any, any, any, any, any> };
    export type VuexPlugin<TStore> = (store: TStore) => any;
    export type VuexStoreDefinition<TState extends {} = any, TMutations extends VuexMutationsTree = VuexMutationsTree, TActions extends VuexActionsTree = VuexActionsTree, TGetters extends VuexGettersTree = VuexGettersTree, TModules extends VuexModulesTree = {} | undefined> = Omit<GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>, "namespaced">
          & {
            strict?: boolean,
            devtools?: boolean,
            plugins?: VuexPlugin<VuexStoreDefinition<TState, TMutations, TActions, TGetters, TModules>>[]
          };
    export type VuexWatchOptions = WatchOptions;

    export interface VuexSubscribeOptions {
        prepend?: boolean;
    }

    export interface VuexMutationSubscriber<TDefinition extends VuexStoreDefinition> {
        (mutation: VuexMutations<TDefinition>): any;
    }

    export type VuexActionSubscriber<TDefinition extends VuexStoreDefinition> = VuexActionSubscriberCallback<TDefinition>
          | VuexActionSubscriberObject<TDefinition>;

    export interface VuexActionSubscriberCallback<TDefinition extends VuexStoreDefinition> {
        (action: VuexActions<TDefinition>, state: VuexState<TDefinition>): any;
    }

    export interface VuexActionErrorSubscriberCallback<TDefinition extends VuexStoreDefinition> {
        (action: VuexActions<TDefinition>, state: VuexState<TDefinition>, error: Error): any;
    }

    export interface VuexActionSubscriberObject<TDefinition extends VuexStoreDefinition> {
        before?: VuexActionSubscriberCallback<TDefinition>;
        after?: VuexActionSubscriberCallback<TDefinition>;
        error?: VuexActionErrorSubscriberCallback<TDefinition>;
    }

    export type VuexUnsubscribeFunction = () => void;

    export interface VuexStore<TDefinition extends VuexStoreDefinition> {
        commit: VuexArgumentStyleCommit<TDefinition> & VuexObjectStyleCommit<TDefinition>;
        dispatch: VuexDispatch<TDefinition>;
        getters: VuexGetters<TDefinition>;
        state: VuexState<TDefinition>;
        constructor(definition: TDefinition);
        replaceState(state: VuexState<TDefinition>): void;
        hotUpdate(options: {
            actions?: VuexActionsTree,
            mutations?: VuexMutationsTree,
            getters?: VuexGettersTree,
            modules?: VuexModulesTree,
            }): void;
        watch<T>(getter: VuexGetter<TDefinition, T>, callback: (value: T, oldValue: T) => void, options?: VuexWatchOptions): VuexUnsubscribeFunction;
        subscribe(mutation: VuexMutationSubscriber<TDefinition>, options?: VuexSubscribeOptions): VuexUnsubscribeFunction;
        subscribeAction(mutation: VuexActionSubscriber<TDefinition>, options?: VuexSubscribeOptions): VuexUnsubscribeFunction;
    }

    export function createStore<TDefinition extends VuexStoreDefinition>(definition: TDefinition): VuexStore<TDefinition>;
}

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any 
      ? R 
      : never;
type AddPrefix<TValue extends string, TPrefix extends string = never> = [TPrefix] extends [never] 
      ? TValue 
      : `${TPrefix}/${TValue}`;
type OptionalPropertyNames<T> = {
        [K in keyof T]-?: undefined extends T[K] ? K : never;
      }[keyof T];
type MakeOptional<TValue, TKeys extends keyof TValue> = { [TKey in TKeys]?: TValue[TKey] };
type UndefinedToOptional<TValue extends {}> = Omit<TValue, OptionalPropertyNames<TValue>>
      & MakeOptional<TValue, OptionalPropertyNames<TValue>>;
type AllPartial<TValue> = TValue extends {} 
      ? {
        [TKey in keyof TValue]?: AllPartial<TValue[TKey]>
      } 
      : TValue;
type Validate<TExpected, TValidated extends TExpected> = TValidated;
type UndefinedKeys<T extends {}> = { [TKey in keyof T]: unknown extends T[TKey] ? TKey : never }[keyof T];
type OmitUndefinedKeys<T extends {}> = Omit<T, UndefinedKeys<T>>;
type IsRequired<T> = unknown extends T 
      ? false 
      : [T] extends [undefined] 
      ? false
      : [T] extends [never]
      ? false
      : true;
