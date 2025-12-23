export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profile: {
                Row: {
                    id: string
                    hero_title: string | null
                    hero_subtitle: string | null
                    hero_description: string | null
                    about_text: string | null
                    skills: string[] | null
                    resume_url: string | null
                    photo_url: string | null
                    photo_position: string | null
                    email: string | null
                    social_links: Json | null
                    personas: Json | null
                }
                Insert: {
                    id?: string
                    hero_title?: string | null
                    hero_subtitle?: string | null
                    hero_description?: string | null
                    about_text?: string | null
                    skills?: string[] | null
                    resume_url?: string | null
                    photo_url?: string | null
                    photo_position?: string | null
                    email?: string | null
                    social_links?: Json | null
                    personas?: Json | null
                }
                Update: {
                    id?: string
                    hero_title?: string | null
                    hero_subtitle?: string | null
                    hero_description?: string | null
                    about_text?: string | null
                    skills?: string[] | null
                    resume_url?: string | null
                    photo_url?: string | null
                    photo_position?: string | null
                    email?: string | null
                    social_links?: Json | null
                    personas?: Json | null
                }
            }
            projects: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    image_url: string | null
                    demo_link: string | null
                    repo_link: string | null
                    tags: string[] | null
                    created_at: string
                    personas: string[] | null
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    image_url?: string | null
                    demo_link?: string | null
                    repo_link?: string | null
                    tags?: string[] | null
                    created_at?: string
                    personas?: string[] | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    image_url?: string | null
                    demo_link?: string | null
                    repo_link?: string | null
                    tags?: string[] | null
                    created_at?: string
                    personas?: string[] | null
                }
            }
            gallery_posts: {
                Row: {
                    id: string
                    title: string | null
                    description: string
                    image_url: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    title?: string | null
                    description: string
                    image_url: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string | null
                    description?: string
                    image_url?: string
                    created_at?: string
                }
            },
            sponsors: {
                Row: {
                    id: string
                    name: string | null
                    logo_url: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name?: string | null
                    logo_url: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    logo_url?: string
                    created_at?: string
                }
            }
        }
    }
}
