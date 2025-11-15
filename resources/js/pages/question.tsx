import MainHeader from '@/components/main/main-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { QuestionData } from '@/types/data';
import QuestionMainContent from './question/question-main-content';

interface QuestionProps {
    questions: QuestionData;
}

export default function Question({ questions }: QuestionProps) {

    const title: string = 'Question';
    const link: string = '/question';

    const subtitle = `${title} Management`;
    const desc = `Manage your ${title}`;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title,
            href: link,
        },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <MainHeader subtitle={subtitle} desc={desc} />
                <QuestionMainContent question={questions.data} />
            </section>
        </AppLayout>
    );
}
