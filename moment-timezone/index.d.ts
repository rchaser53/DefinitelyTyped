// Type definitions for moment-timezone.js 0.2.5
// Project: http://momentjs.com/timezone/
// Definitions by: Michel Salib <https://github.com/michelsalib>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as moment from 'moment';

export as namespace MomentTimezone;
export = moment;

declare namespace MomentTimezone {
    interface MomentZone {
        name: string;
        abbrs: string[];
        untils: number[];
        offsets: number[];

        abbr(timestamp: number): string;
        offset(timestamp: number): number;
        parse(timestamp: number): number
    }

    type MomentFormatSpecification =
        string | (() => void) | (string | (() => void))[];

    interface MomentTimezone {
        (): moment.Moment;
        (timezone: string): moment.Moment;
        (date: number, timezone: string): moment.Moment;
        (date: number[], timezone: string): moment.Moment;
        (date: string, timezone: string): moment.Moment;
        (date: string, format: MomentFormatSpecification, timezone: string): moment.Moment;
        (date: string, format: MomentFormatSpecification, strict: boolean, timezone: string): moment.Moment;
        (date: string, format: MomentFormatSpecification, language: string, timezone: string): moment.Moment;
        (date: string, format: MomentFormatSpecification, language: string, strict: boolean, timezone: string): moment.Moment;
        (date: Date, timezone: string): moment.Moment;
        (date: moment.Moment, timezone: string): moment.Moment;
        (date: Object, timezone: string): moment.Moment;

        zone(timezone: string): MomentZone;

        add(packedZoneString: string): void;
        add(packedZoneString: string[]): void;

        link(packedLinkString: string): void;
        link(packedLinkString: string[]): void;

        load(data: {
            version: string;
            links: string[];
            zones: string[];
        }): void;

        names(): string[];
        guess(): string;

        setDefault(timezone: string): void;
    }

}

declare module "moment" {
    interface Moment {
        tz(): string;
        tz(timezone: string): Moment;
        zoneAbbr() :Moment;
        zoneName() :Moment;
    }

    const tz: MomentTimezone.MomentTimezone;
}
