import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Volume2, Trash2, Award, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ParrotMascot from "../components/mascot/ParrotMascot";

export default function Library() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newWord, setNewWord] = useState({
    word: "",
    translation: "",
    phonetic: "",
    category: "basics",
    difficulty: "beginner",
    example_sentence: "",
  });

  const queryClient = useQueryClient();

  const { data: words = [], isLoading } = useQuery({
    queryKey: ['words'],
    queryFn: () => base44.entities.Word.list("-created_date"),
  });

  const createWordMutation = useMutation({
    mutationFn: (data) => base44.entities.Word.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      setShowAddForm(false);
      setNewWord({
        word: "",
        translation: "",
        phonetic: "",
        category: "basics",
        difficulty: "beginner",
        example_sentence: "",
      });
    },
  });

  const deleteWordMutation = useMutation({
    mutationFn: (id) => base44.entities.Word.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
    },
  });

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.translation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || word.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Word Library
            </h1>
            <p className="text-gray-500">Manage your Hebrew vocabulary</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Word
          </Button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="border-2 border-violet-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Add New Word</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Hebrew Word *</Label>
                      <Input
                        value={newWord.word}
                        onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                        placeholder="e.g., שלום"
                        className="mt-1 text-right"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label>English Translation *</Label>
                      <Input
                        value={newWord.translation}
                        onChange={(e) => setNewWord({ ...newWord, translation: e.target.value })}
                        placeholder="e.g., Hello"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Phonetic</Label>
                      <Input
                        value={newWord.phonetic}
                        onChange={(e) => setNewWord({ ...newWord, phonetic: e.target.value })}
                        placeholder="e.g., shalom"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select value={newWord.category} onValueChange={(value) => setNewWord({ ...newWord, category: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basics">Basics</SelectItem>
                          <SelectItem value="numbers">Numbers</SelectItem>
                          <SelectItem value="colors">Colors</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="animals">Animals</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="nature">Nature</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="emotions">Emotions</SelectItem>
                          <SelectItem value="actions">Actions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <Select value={newWord.difficulty} onValueChange={(value) => setNewWord({ ...newWord, difficulty: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Example Sentence (Hebrew)</Label>
                      <Textarea
                        value={newWord.example_sentence}
                        onChange={(e) => setNewWord({ ...newWord, example_sentence: e.target.value })}
                        placeholder="Example usage in Hebrew..."
                        className="mt-1 text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => createWordMutation.mutate(newWord)}
                      disabled={!newWord.word || !newWord.translation || !newWord.category}
                      className="flex-1 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
                    >
                      Add Word
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search words..."
              className="pl-10 border-2 border-violet-100 rounded-xl"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48 border-2 border-violet-100 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="basics">Basics</SelectItem>
              <SelectItem value="numbers">Numbers</SelectItem>
              <SelectItem value="colors">Colors</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="animals">Animals</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="nature">Nature</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="emotions">Emotions</SelectItem>
              <SelectItem value="actions">Actions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredWords.map((word) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <Card className="border border-violet-100 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1" dir="rtl">
                        <h3 className="text-2xl font-bold text-gray-800">{word.word}</h3>
                        {word.phonetic && (
                          <p className="text-sm text-gray-500" dir="ltr">/{word.phonetic}/</p>
                        )}
                      </div>
                      {word.mastered && (
                        <Award className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    
                    <p className="text-lg text-gray-600 mb-3">{word.translation}</p>
                    
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="inline-block px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium">
                        {word.category}
                      </span>
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {word.difficulty}
                      </span>
                    </div>

                    {word.example_sentence && (
                      <p className="text-sm text-gray-500 italic mb-3" dir="rtl">"{word.example_sentence}"</p>
                    )}

                    <div className="text-xs text-gray-400 mb-3">
                      Practiced {word.times_practiced || 0} times
                    </div>

                    <div className="flex gap-2">
                      {word.audio_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playAudio(word.audio_url)}
                          className="flex-1"
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteWordMutation.mutate(word.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No words found</p>
          </div>
        )}
      </div>
    </div>
  );
}