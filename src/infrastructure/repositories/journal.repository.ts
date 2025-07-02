import { CoursesRepository, Course } from "@/domain/models/courses.interface";
import { db } from "@/infrastructure/database/client";
import { courses } from "@/infrastructure/database/schemas/courses.schema";
import { eq } from "drizzle-orm";

export class CoursesRepositoryImpl implements CoursesRepository {
  async getAllCourses(): Promise<{ data: Course[]; error?: Error }> {
    try {
      const data = await db.select().from(courses);
      return { data };
    } catch (error) {
      console.error("Repository error in getAllCourses:", error);
      return { data: [], error: error as Error };
    }
  }

  async getCourseById(
    id: string
  ): Promise<{ data: Course | null; error?: Error }> {
    try {
      const data = await db.select().from(courses).where(eq(courses.id, id));

      if (data.length === 0) {
        return {
          data: null,
          error: new Error(`Course with id ${id} not found`),
        };
      }

      return { data: data[0] };
    } catch (error) {
      console.error("Repository error in getCourseById:", error);
      return { data: null, error: error as Error };
    }
  }
}

// Factory function for easier dependency injection
export const createCoursesRepository = (): CoursesRepository => {
  return new CoursesRepositoryImpl();
};
