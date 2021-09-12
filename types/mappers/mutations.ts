import { VuexCommit, VuexModule, VuexModulePath, VuexMutationPayload, VuexMutationTypes } from "..";
import { ArrayEntries } from "../helpers";

type VuexMutationsObjectMapping<TModule extends VuexModule>
  = { [mapped: string]: VuexMutationsMappingEntry<TModule> }

type VuexMutationsArrayMapping<TModule extends VuexModule>
  = (VuexMutationTypes<TModule>)[]

type VuexMutationsMapping<TModule extends VuexModule>
  = VuexMutationsObjectMapping<TModule>
  | VuexMutationsArrayMapping<TModule>

export type VuexMutationsMappingFunctionEntry<TModule extends VuexModule, TArgs extends any[] = any[]>
  = ((commit: VuexCommit<TModule>, ...args: TArgs) => void)

export type VuexMutationsMappingEntry<TModule extends VuexModule, TArgs extends any[] = any[]> 
  = VuexMutationTypes<TModule>
  | VuexMutationsMappingFunctionEntry<TModule, TArgs>

export type VuexMappedMutations<
  TModule extends VuexModule,
  TMapping extends VuexMutationsMapping<TModule>,
> = TMapping extends VuexMutationsObjectMapping<TModule> ? VuexMappedMutationsFromObject<TModule, TMapping>
  : TMapping extends VuexMutationsArrayMapping<TModule> ? VuexMappedMutationsFromArray<TModule, TMapping>
  : never

export type VuexMappedMutation<
  TModule extends VuexModule, 
  TAction extends VuexMutationsMappingEntry<TModule>
> = TAction extends VuexMutationTypes<TModule> ? (payload: VuexMutationPayload<TModule, TAction>) => void
  : TAction extends VuexMutationsMappingFunctionEntry<TModule, infer TArgs> ? (...args: TArgs) => void 
  : unknown

export type VuexMappedMutationsFromObject<
  TModule extends VuexModule,
  TMapping extends VuexMutationsObjectMapping<TModule>,
> = { [TKey in keyof TMapping]: VuexMappedMutation<TModule, TMapping[TKey]> }

export type VuexMappedMutationsFromArray<
  TModule extends VuexModule,
  TMapping extends VuexMutationsArrayMapping<TModule>,
> = VuexMappedMutationsFromObject<TModule, { [TProp in ArrayEntries<TMapping, VuexMutationTypes<TModule>>]: TProp }>

export interface VuexBoundMapMutationsHelper<TModule extends VuexModule> {
  <TMapping extends VuexMutationsObjectMapping<TModule>>(mapping: TMapping): VuexMappedMutationsFromObject<TModule, TMapping>;
}

export interface VuexMapMutationsHelper<TModule extends VuexModule> extends VuexBoundMapMutationsHelper<TModule> {
  <TPath extends VuexModulePath<TModule>, TMapping extends VuexMutationsMapping<TModule>>(path: TPath, mapping: TMapping): VuexMappedMutations<TModule, TMapping>;
}

export declare const mapMutations: VuexMapMutationsHelper<any>;