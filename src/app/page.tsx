import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/database.types";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // Manual casting if inference fails
  const typedProfile = profile as Database["public"]["Tables"]["profile"]["Row"] | null;
  const typedProjects = projects as Database["public"]["Tables"]["projects"]["Row"][] | null;

  return (
    <main className="min-h-screen">
      <Header />
      <Hero
        title={typedProfile?.hero_title}
        subtitle={typedProfile?.hero_subtitle}
        description={typedProfile?.hero_description}
        photoUrl={typedProfile?.photo_url}
        resumeUrl={typedProfile?.resume_url}
        personas={typedProfile?.personas}
      />
      <About
        aboutText={typedProfile?.about_text}
        skills={typedProfile?.skills}
        personas={typedProfile?.personas}
      />
      <Projects projects={typedProjects || []} />
      <Contact />
    </main>
  );
}
