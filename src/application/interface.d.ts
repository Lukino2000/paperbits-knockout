import { Intentions } from "./codegen/intentionContracts";

export interface IAppIntentionsProvider
{
    getIntentions(): Intentions;
}