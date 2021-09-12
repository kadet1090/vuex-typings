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
    export type VuexGettersTree<TModule extends VuexModule = any, TRoot extends VuexModule = any> = { [name: string]: VuexGetter<TModule, any, TRoot, any>; };
    export type VuexGetter<TModule extends VuexModule<any, any, any, any>, TResult, TRoot extends VuexModule<any, any, any, any> = any, TGetters = VuexGetters<TModule>> = (state: VuexState<TModule>, getters: TGetters, rootState: VuexState<TRoot>, rootGetters: VuexGetters<TRoot>) => TResult;
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
    export type VuexModulePathOwn<TModule extends VuexModule<any, any, any, any>, TPrefix extends string[] = never> = [TPrefix] extends [never]
          ? keyof TModule["modules"] 
          | { [TName in keyof TModule["modules"]]: [TName] }[keyof TModule["modules"]]
          : { [TName in keyof TModule["modules"]]: [ ...TPrefix, TName ] }[keyof TModule["modules"]];
    export type VuexModulePathModules<TModules, TPrefix extends string[] = never> = { 
            [TModule in keyof TModules]: 
              VuexModulePathOwn<
                TModules[TModule], 
                [TPrefix] extends [never] ? [TModule & string] : [...TPrefix, TModule & string]
              > 
          }[keyof TModules];
    export type VuexModulesWithPath<TModule extends VuexModule<any, any, any, any>, TPrefix extends string[] = never> = VuexModulesWithPathOwn<TModule, TPrefix>
          | VuexModulesWithPathModules<TModule["modules"], TPrefix>;
    export type VuexModulesWithPathOwn<TModule extends VuexModule<any, any, any, any>, TPrefix extends string[] = never> = [TPrefix] extends [never]
          ? { 
            [TName in keyof TModule["modules"]]: { 
              path: [TName], 
              definition: TModule["modules"][TName] 
            } 
          }[keyof TModule["modules"]]
          : { 
            [TName in keyof TModule["modules"]]: {
              path: [ ...TPrefix, TName ],
              definition: TModule["modules"][TName] 
            }
          }[keyof TModule["modules"]];
    export type VuexModulesWithPathModules<TModules, TPrefix extends string[] = never> = { 
            [TModule in keyof TModules]: 
              VuexModulesWithPathOwn<
                TModules[TModule], 
                [TPrefix] extends [never] ? [TModule & string] : [...TPrefix, TModule & string]
              > 
          }[keyof TModules];
    export type VuexModulePath<TModule extends VuexModule<any, any, any, any>, TPrefix extends string[] = never> = VuexModulePathOwn<TModule, TPrefix>
          | VuexModulePathModules<TModule["modules"], TPrefix>;
    export type VuexModuleByPath<TModule extends VuexModule<any, any, any, any>, TPath extends VuexModulePath<TModule>> = Extract<
            { path: TPath, definition: any }, 
            VuexModulesWithPath<TModule>
          >["definition"];

    export interface VuexModuleOptions {
        preserveState?: boolean;
    }

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
        new(definition: TDefinition);
        install: InstallFunction;
        commit: VuexArgumentStyleCommit<TDefinition> & VuexObjectStyleCommit<TDefinition>;
        dispatch: VuexDispatch<TDefinition>;
        getters: VuexGetters<TDefinition>;
        state: VuexState<TDefinition>;
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
        registerModule<TPath extends VuexModulePath<TDefinition>>(path: TPath, module: VuexModuleByPath<TDefinition, TPath>, options?: VuexModuleOptions): void;
        unregisterModule(path: VuexModulePath<TDefinition>): void;
        hasModule(path: VuexModulePath<TDefinition>): boolean;
    }

    export function createStore<TDefinition extends VuexStoreDefinition>(definition: TDefinition): VuexStore<TDefinition>;

    export function install(...args: any[]): any;

    export type InstallFunction = typeof install;

    export class Store<TDefinition extends VuexStoreDefinition> {
        constructor(definition: TDefinition);
    }

    export interface Store<TDefinition extends VuexStoreDefinition> extends VuexStore<TDefinition> {
    }

    type VuexStateObjectMapping<TModule extends VuexModule> = { [mapped: string]: VuexStateMappingEntry<VuexState<TModule>> };
    type VuexStateArrayMapping<TModule extends VuexModule> = (keyof VuexState<TModule>)[];
    type VuexStateMapping<TModule extends VuexModule> = VuexStateObjectMapping<TModule>
          | VuexStateArrayMapping<TModule>;
    export type VuexStateMappingEntry<TState, TReturn = any> = keyof TState 
          | ((state: TState) => TReturn);
    export type VuexMappedStateByFunction<TModule extends VuexModule, TMapping extends { [TKey in keyof TMapping]: (state: VuexState<TModule>) => any }> = { [TKey in keyof TMapping]: () => ReturnType<TMapping[TKey]> };
    export type VuexMappedStateByPropertyName<TModule extends VuexModule, TMapping extends { [TKey in keyof TMapping]: keyof VuexState<TModule> }> = { [TKey in keyof TMapping]: () => VuexState<TModule>[TMapping[TKey]] };
    export type VuexMappedStateFromObject<TModule extends VuexModule, TMapping extends VuexStateObjectMapping<TModule>> = VuexMappedStateByPropertyName<TModule, PickByValue<TMapping, keyof VuexState<TModule>>>
          & VuexMappedStateByFunction<TModule, PickByValue<TMapping, Function>>;
    export type VuexMappedStateFromArray<TModule extends VuexModule, TMapping extends VuexStateArrayMapping<TModule>> = VuexMappedStateFromObject<TModule, { [TProp in ArrayEntries<TMapping, keyof VuexState<TModule>>]: TProp }>;
    export type VuexMappedState<TModule extends VuexModule, TMapping extends VuexStateMapping<TModule>> = TMapping extends VuexStateObjectMapping<TModule> ? VuexMappedStateFromObject<TModule, TMapping>
          : TMapping extends VuexStateArrayMapping<TModule> ? VuexMappedStateFromArray<TModule, TMapping>
          : never;

    export interface VuexBoundMapStateHelper<TModule extends VuexModule> {
        <TMapping extends VuexStateMapping<TModule>>(mapping: TMapping): VuexMappedState<TModule, TMapping>;
    }

    export interface VuexMapStateHelper<TModule extends VuexModule> extends VuexBoundMapStateHelper<TModule> {
        <TPath extends VuexModulePath<TModule>, TMapping extends VuexStateMapping<TModule>>(path: TPath, mapping: TMapping): VuexMappedState<TModule, TMapping>;
    }

    type VuexMutationsObjectMapping<TModule extends VuexModule> = { [mapped: string]: VuexMutationsMappingEntry<TModule> };
    type VuexMutationsArrayMapping<TModule extends VuexModule> = (VuexMutationTypes<TModule>)[];
    type VuexMutationsMapping<TModule extends VuexModule> = VuexMutationsObjectMapping<TModule>
          | VuexMutationsArrayMapping<TModule>;
    export type VuexMutationsMappingFunctionEntry<TModule extends VuexModule, TArgs extends any[] = any[]> = ((commit: VuexCommit<TModule>, ...args: TArgs) => void);
    export type VuexMutationsMappingEntry<TModule extends VuexModule, TArgs extends any[] = any[]> = VuexMutationTypes<TModule>
          | VuexMutationsMappingFunctionEntry<TModule, TArgs>;
    export type VuexMappedMutations<TModule extends VuexModule, TMapping extends VuexMutationsMapping<TModule>> = TMapping extends VuexMutationsObjectMapping<TModule> ? VuexMappedMutationsFromObject<TModule, TMapping>
          : TMapping extends VuexMutationsArrayMapping<TModule> ? VuexMappedMutationsFromArray<TModule, TMapping>
          : never;
    export type VuexMappedMutation<TModule extends VuexModule, TAction extends VuexMutationsMappingEntry<TModule>> = TAction extends VuexMutationTypes<TModule> ? (payload: VuexMutationPayload<TModule, TAction>) => void
          : TAction extends VuexMutationsMappingFunctionEntry<TModule, infer TArgs> ? (...args: TArgs) => void 
          : unknown;
    export type VuexMappedMutationsFromObject<TModule extends VuexModule, TMapping extends VuexMutationsObjectMapping<TModule>> = { [TKey in keyof TMapping]: VuexMappedMutation<TModule, TMapping[TKey]> };
    export type VuexMappedMutationsFromArray<TModule extends VuexModule, TMapping extends VuexMutationsArrayMapping<TModule>> = VuexMappedMutationsFromObject<TModule, { [TProp in ArrayEntries<TMapping, VuexMutationTypes<TModule>>]: TProp }>;

    export interface VuexBoundMapMutationsHelper<TModule extends VuexModule> {
        <TMapping extends VuexMutationsObjectMapping<TModule>>(mapping: TMapping): VuexMappedMutationsFromObject<TModule, TMapping>;
    }

    export interface VuexMapMutationsHelper<TModule extends VuexModule> extends VuexBoundMapMutationsHelper<TModule> {
        <TPath extends VuexModulePath<TModule>, TMapping extends VuexMutationsMapping<TModule>>(path: TPath, mapping: TMapping): VuexMappedMutations<TModule, TMapping>;
    }

    type VuexGettersObjectMapping<TModule extends VuexModule> = { [mapped: string]: VuexGettersMappingEntry<VuexGetters<TModule>> };
    type VuexGettersArrayMapping<TModule extends VuexModule> = (keyof VuexGetters<TModule>)[];
    type VuexGettersMapping<TModule extends VuexModule> = VuexGettersObjectMapping<TModule>
          | VuexGettersArrayMapping<TModule>;
    export type VuexGettersMappingEntry<TGetters> = keyof TGetters;
    export type VuexMappedGettersByPropertyName<TModule extends VuexModule, TMapping extends { [TKey in keyof TMapping]: keyof VuexGetters<TModule> }> = { [TKey in keyof TMapping]: () => VuexGetters<TModule>[TMapping[TKey]] };
    export type VuexMappedGettersFromObject<TModule extends VuexModule, TMapping extends VuexGettersObjectMapping<TModule>> = VuexMappedGettersByPropertyName<TModule, PickByValue<TMapping, keyof VuexGetters<TModule>>>;
    export type VuexMappedGettersFromArray<TModule extends VuexModule, TMapping extends VuexGettersArrayMapping<TModule>> = VuexMappedGettersFromObject<TModule, { [TProp in ArrayEntries<TMapping, keyof VuexGetters<TModule>>]: TProp }>;
    export type VuexMappedGetters<TModule extends VuexModule, TMapping extends VuexGettersMapping<TModule>> = TMapping extends VuexGettersObjectMapping<TModule> ? VuexMappedGettersFromObject<TModule, TMapping>
          : TMapping extends VuexGettersArrayMapping<TModule> ? VuexMappedGettersFromArray<TModule, TMapping>
          : never;

    export interface VuexBoundMapGettersHelper<TModule extends VuexModule> {
        <TMapping extends VuexGettersMapping<TModule>>(mapping: TMapping): VuexMappedGetters<TModule, TMapping>;
    }

    export interface VuexMapGettersHelper<TModule extends VuexModule> extends VuexBoundMapGettersHelper<TModule> {
        <TPath extends VuexModulePath<TModule>, TMapping extends VuexGettersMapping<TModule>>(path: TPath, mapping: TMapping): VuexMappedGetters<TModule, TMapping>;
    }

    export interface VuexNamespaceHelpers<TModule extends VuexModule> {
        mapState: VuexBoundMapStateHelper<TModule>;
        mapGetters: VuexBoundMapGettersHelper<TModule>;
    }

    export interface VuexCreateNamespacedHelpers<TModule extends VuexModule> {
        <TPath extends VuexModulePath<TModule>>(path: TPath): VuexNamespaceHelpers<VuexModuleByPath<TModule, TPath>>;
    }
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
type KeysMatching<TObject, TPattern> = { 
        [TProp in keyof TObject]: TObject[TProp] extends TPattern ? TProp : never
      }[keyof TObject];
type PickByValue<TObject, TPattern> = Pick<TObject, KeysMatching<TObject, TPattern>>;
type ArrayEntries<TArray extends TType[], TType = string> = Extract<TArray[keyof TArray], TType>;
type IsRequired<T> = unknown extends T ? false 
      : [T] extends [undefined] ? false
      : [T] extends [never] ? false
      : true;
type OneOrMany<T> = T 
      | T[];
