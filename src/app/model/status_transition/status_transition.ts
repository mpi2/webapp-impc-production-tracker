import { Transition } from './transition';

export class StatusTransition {
    currentStatus: string;
    transitions: Transition[];
    actionToExecute: string;
}
