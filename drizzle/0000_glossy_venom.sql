CREATE TABLE "mindmap_nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" text NOT NULL,
	"parent_id" uuid,
	"map_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mindmaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "mindmap_nodes" ADD CONSTRAINT "mindmap_nodes_parent_id_mindmap_nodes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mindmap_nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mindmap_nodes" ADD CONSTRAINT "mindmap_nodes_map_id_mindmaps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."mindmaps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mindmaps" ADD CONSTRAINT "mindmaps_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;