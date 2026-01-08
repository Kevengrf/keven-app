'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextLocale = event.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <label className="border-2 rounded p-2 bg-background text-foreground flex gap-2 items-center">
            <p className="sr-only">{t('label')}</p>
            <select
                defaultValue={locale}
                className="bg-transparent py-1"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="pt">{t('pt')}</option>
                <option value="en">{t('en')}</option>
            </select>
        </label>
    );
}
