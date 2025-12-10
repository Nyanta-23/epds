import { PostpartumVisit } from '@/types/resource';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface CardPospartumAnswerProps {
    postpartum: PostpartumVisit;
}
export default function CardPostpartumAnswer({
    postpartum,
}: CardPospartumAnswerProps) {
    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Answers</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[260px] pr-2">
                    <div className="space-y-3">
                        {postpartum.answers.map((answer, i) => (
                            <div
                                key={i}
                                className="rounded-lg border bg-muted/30 p-3"
                            >
                                <p className="font-medium">Question {i + 1}</p>
                                <p className="text-sm text-muted-foreground">
                                    {answer.question.question}
                                </p>
                                <div className="mt-2 flex flex-col gap-2">
                                    {answer.question.options.map(
                                        (option, i) => (
                                            <span className="text-sm text-muted-foreground">
                                                {option.option}.{' '}
                                                {option.option_text}
                                            </span>
                                        ),
                                    )}
                                </div>
                                <span className="mt-3 text-sm text-muted-foreground">
                                    Jawaban : {answer.answer}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
