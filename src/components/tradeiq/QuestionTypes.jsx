import React, { useState } from "react";
import { CheckCircle2, XCircle, ChevronUp, ChevronDown, Eye, Lightbulb, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Flashcard: user reveals the answer, then self-assesses
export function FlashcardQuestion({ question, answered, onAnswered, showExplanation }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="border-tiq-border">
      <CardHeader>
        <CardTitle className="font-slab text-tiq-ink text-lg">{question.q}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!revealed && !answered && (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Think about the answer, then check if you were correct with the reveal button.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => setRevealed(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Reveal Answer
              </Button>
            </div>
          </div>
        )}
        {(revealed || answered) && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-tiq-mintLight to-white border border-tiq-mint/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-tiq-mint/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-tiq-mint" />
                </div>
                <span className="font-slab text-sm font-semibold text-tiq-mint uppercase tracking-wide">Answer</span>
              </div>
              <p className="text-base text-tiq-ink leading-relaxed">{question.answerText}</p>
            </div>
            {!answered && (
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => onAnswered(false)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  ❌ I Forgot This
                </Button>
                <Button
                  onClick={() => onAnswered(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  ✅ I Remembered This
                </Button>
              </div>
            )}
            {answered && showExplanation && question.explain && (
              <div className="p-3.5 rounded-lg bg-tiq-mintLight border border-tiq-border">
                <p className="text-sm text-slate-700">{question.explain}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Fill-in-the-blank: user types the answer, case-insensitive match
export function FillInBlankQuestion({ question, answered, onAnswered, showExplanation }) {
  const [input, setInput] = useState("");
  const parts = question.q.split("_______");

  const submit = () => {
    const correct = input.trim().toLowerCase() === (question.answerText || "").trim().toLowerCase();
    onAnswered(correct);
  };

  return (
    <div className="space-y-5 text-center">
      <h2 className="font-slab text-xl text-tiq-ink font-bold leading-relaxed">
        {parts[0]}
        {!answered ? (
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && input.trim() && submit()}
            className="inline-flex w-48 mx-2 align-middle"
            placeholder="Type answer..."
            disabled={answered}
          />
        ) : (
          <span className="font-mono-tiq text-tiq-mint font-bold mx-1">
            {question.answerText}
          </span>
        )}
        {parts[1]}
      </h2>
      {!answered && (
        <div className="flex justify-center">
          <Button
            onClick={submit}
            disabled={!input.trim()}
            className="bg-tiq-mint text-white hover:bg-tiq-mint/90"
          >
            Submit
          </Button>
        </div>
      )}
      {answered && showExplanation && question.explain && (
        <div className="p-3.5 rounded-lg bg-tiq-mintLight border border-tiq-border">
          <p className="text-sm text-slate-700">{question.explain}</p>
        </div>
      )}
    </div>
  );
}

// Sorting: user drags or uses buttons to reorder shuffled items to match the correct sequence
export function SortingQuestion({ question, answered, onAnswered, showExplanation }) {
  const [items, setItems] = useState(() => {
    const opts = [...question.options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  });

  const move = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  };

  const onDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const newItems = [...items];
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setItems(newItems);
  };

  const submit = () => {
    const correct = items.every((item, i) => item === question.options[i]);
    onAnswered(correct);
  };

  const letterFor = (item) => {
    const correctIdx = question.options.indexOf(item);
    return String.fromCharCode(65 + correctIdx);
  };

  return (
    <div className="space-y-5">
      <h2 className="font-slab text-xl text-tiq-ink font-bold">{question.q}</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sorting-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 transition ${snapshot.isDraggingOver ? "bg-tiq-mintLight/40 rounded-lg p-1 -m-1" : ""}`}
            >
              {items.map((item, i) => {
                const isCorrectPos = answered && item === question.options[i];
                const isWrongPos = answered && item !== question.options[i];
                return (
                  <Draggable key={item} draggableId={item} index={i} isDragDisabled={answered}>
                    {(prov, snap) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition ${
                          isCorrectPos
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : isWrongPos
                            ? "border-red-500/50 bg-red-500/10"
                            : "border-tiq-border bg-white"
                        } ${snap.isDragging ? "shadow-lg ring-2 ring-tiq-mint/40 z-50" : ""}`}
                      >
                        {!answered && (
                          <span
                            {...prov.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0 touch-none"
                          >
                            <GripVertical className="w-5 h-5" />
                          </span>
                        )}
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono-tiq shrink-0 text-slate-500">
                          {letterFor(item)}
                        </span>
                        <span className="text-sm flex-1 text-slate-700">{item}</span>
                        {isCorrectPos && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                        {isWrongPos && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                        {!answered && (
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => move(i, -1)}
                              disabled={i === 0}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => move(i, 1)}
                              disabled={i === items.length - 1}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {!answered && (
        <Button
          onClick={submit}
          className="bg-tiq-mint text-white hover:bg-tiq-mint/90"
        >
          Submit Order
        </Button>
      )}
      {answered && (
        <div className="p-3.5 rounded-lg bg-tiq-mintLight border border-tiq-border">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Correct Sequence</p>
          <div className="space-y-1.5">
            {question.options.map((opt, i) => (
              <div key={i} className="text-sm text-slate-700 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-tiq-mint/10 border border-tiq-mint/30 flex items-center justify-center text-[10px] font-mono-tiq text-tiq-mint shrink-0 font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
              </div>
            ))}
          </div>
          {showExplanation && question.explain && (
            <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-tiq-border">{question.explain}</p>
          )}
        </div>
      )}
    </div>
  );
}