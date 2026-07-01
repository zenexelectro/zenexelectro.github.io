"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Admin CMS Dashboard / അഡ്മിന് വിവരങ്ങൾ ചേർക്കാനുള്ള ഡാഷ്ബോർഡ്
export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Content Publisher (വിവരങ്ങൾ ചേർക്കുക)</h1>
      <p className="text-zinc-500">
        Posts will be saved securely to the GitHub &quot;POST&quot; folder. 
        <br/>
        നിങ്ങൾ ഇവിടെ നൽകുന്ന വിവരങ്ങൾ സുരക്ഷിതമായി ഗിറ്റ്ഹബ്ബിലെ &quot;POST&quot; ഫോൾഡറിൽ സേവ് ആകും.
      </p>

      {/* Post creation form / പോസ്റ്റ് ചെയ്യാനുള്ള ഫോം */}
      <form className="space-y-6 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <label className="font-semibold text-sm">Post Title (തലക്കെട്ട്)</label>
          <Input placeholder="Enter title..." className="bg-white dark:bg-black" />
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-sm">Description (വിവരണം)</label>
          <Textarea placeholder="Write your post here..." rows={6} className="bg-white dark:bg-black" />
        </div>

        {/* Submit button / സബ്മിറ്റ് ബട്ടൺ */}
        <Button className="w-full h-12 text-lg">Publish to GitHub (പബ്ലിഷ് ചെയ്യുക)</Button>
      </form>
    </div>
  );
}
