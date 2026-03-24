import { Answer, PostpartumVisit } from '@/types/resource';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle } from 'lucide-react';

interface CardPostpartumAnswerProps {
    postpartum: PostpartumVisit;
}

/**
 * Derive numeric score for an answer by matching the selected option text
 * against the question's option list.
 */
function getScore(answer: Answer): number | null {
    const matched = answer.question.options.find(
        (opt) => opt.option === answer.answer,
    );
    return matched?.value ?? null;
}

function getRowStyle(
    questionNumber: string,
    score: number | null,
    index: number,
): {
    rowClass: string;
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
    badgeClass: string;
} {
    const isQ10 = questionNumber === '10';

    if (isQ10 && score !== null && score > 0) {
        return { 
            rowClass: 'bg-destructive/10', 
            badgeVariant: 'destructive',
            badgeClass: 'bg-destructive text-destructive-foreground border-none'
        };
    }

    const alternateBg = index % 2 === 0 ? 'bg-transparent' : 'bg-muted/50';

    if (score === null || score === 0) {
        return { rowClass: alternateBg, badgeVariant: 'outline', badgeClass: 'text-muted-foreground border-border' };
    }
    if (score === 1) {
        return { rowClass: alternateBg, badgeVariant: 'secondary', badgeClass: 'bg-muted text-foreground hover:bg-muted border-none' };
    }
    if (score === 2) {
        return { rowClass: alternateBg, badgeVariant: 'secondary', badgeClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 border-none' };
    }
    // score >= 3
    return { rowClass: alternateBg, badgeVariant: 'destructive', badgeClass: 'bg-destructive text-destructive-foreground border-none' };
}

export default function CardPostpartumAnswer({
    postpartum,
}: CardPostpartumAnswerProps) {
    const answers = [...postpartum.answers].sort(
        (a, b) =>
            Number(a.question.number_question) -
            Number(b.question.number_question),
    );

    const hasQ10Alert = answers.some((a) => {
        const n = a.question.number_question;
        const s = getScore(a);
        return n === '10' && s !== null && s > 0;
    });

    return (
        <Card className=" shadow-sm p-0 overflow-hidden">
            <CardHeader className="p-4 sm:p-5 md:p-6  border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <CardTitle className="text-base font-semibold ">
                        Detail Jawaban EPDS
                    </CardTitle>
                    {hasQ10Alert && (
                        <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            Pertanyaan no.10 terindikasi risiko!
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto rounded-b-xl">
                    <table className="w-full min-w-[480px] text-sm">
                        <thead className="">
                            <tr className="border-b text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="w-12 px-4 py-3 text-center">No</th>
                                <th className="px-4 py-3">Pertanyaan</th>
                                <th className="hidden px-4 py-3 sm:table-cell">Jawaban</th>
                                <th className="w-20 px-4 py-3 text-center">Skor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {answers.map((answer, index) => {
                                const score = getScore(answer);
                                const qNum = answer.question.number_question;
                                const { rowClass, badgeVariant, badgeClass } = getRowStyle(qNum, score, index);
                                const isQ10 = qNum === '10' && score !== null && score > 0;

                                return (
                                    <tr
                                        key={answer.id}
                                        className={`transition-colors ${rowClass}`}
                                    >
                                        <td className="px-4 py-3 text-center text-sm font-semibold tabular-nums ">
                                            {qNum}
                                        </td>
                                        <td className="px-3 py-2.5 leading-snug">
                                            <span className={isQ10 ? 'text-destructive font-semibold' : ''}>
                                                {answer.question.question}
                                            </span>
                                            {/* On mobile: show answer inline below question */}
                                            <p className={`mt-0.5 text-xs sm:hidden ${isQ10 ? 'text-destructive/80 font-medium' : 'text-muted-foreground'}`}>
                                                {answer.question.options.find(
                                                    (opt) => opt.option === answer.answer,
                                                )?.option_text ?? answer.answer}
                                            </p>
                                        </td>
                                        <td className={`hidden px-3 py-2.5 sm:table-cell ${isQ10 ? 'text-destructive/80 font-medium' : 'text-muted-foreground'}`}><p>
                                            {answer.question.options.find(
                                                (opt) => opt.option === answer.answer,
                                            )?.option_text ?? answer.answer}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {score !== null ? (
                                                <Badge
                                                    variant={badgeVariant}
                                                    className={`min-w-[1.75rem] justify-center tabular-nums shadow-sm ${badgeClass}`}
                                                >
                                                    {score}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground font-medium text-sm">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {/* Total row */}
                        {postpartum.result && (
                            <tfoot className="">
                                <tr className="border-t shadow-sm">
                                    <td
                                        colSpan={3}
                                        className="px-4 py-3 text-right text-sm"
                                    >
                                        Total Skor EPDS
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge
                                            variant={
                                                postpartum.result.total_score >= 13
                                                    ? 'destructive'
                                                    : postpartum.result.total_score >= 10
                                                      ? 'secondary'
                                                      : 'default'
                                            }
                                            className="min-w-[1.75rem] justify-center tabular-nums"
                                        >
                                            {postpartum.result.total_score}
                                        </Badge>
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
