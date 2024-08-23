import { Directive, Input } from "@angular/core";

@Directive({
    selector: '[space-restrict]',
    host: {
        '(keydown)': '_onKeyDown($event)'
    }
})
export class SpaceRestrictDirective {

    _onKeyDown(e: KeyboardEvent) {
        if (e.code === 'Space') {
            e.preventDefault();
        }
    }
}