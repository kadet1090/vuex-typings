import { VuexModule, VuexModuleByPath, VuexModulePath } from "..";
import { VuexBoundMapStateHelper } from "./state";
import { VuexBoundMapGettersHelper } from "./getters";

export interface VuexNamespaceHelpers<TModule extends VuexModule> {
  mapState: VuexBoundMapStateHelper<TModule>;
  mapGetters: VuexBoundMapGettersHelper<TModule>;
}

export interface VuexCreateNamespacedHelpers<TModule extends VuexModule> {
  <TPath extends VuexModulePath<TModule>>(path: TPath): VuexNamespaceHelpers<VuexModuleByPath<TModule, TPath>>;
}

export declare const createNamespacedHelpers: VuexCreateNamespacedHelpers<any>;

export * from "./state";
export * from "./getters";
export * from "./mutations";
export * from "./actions";