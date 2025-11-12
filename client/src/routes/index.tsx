import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your chat rom</CardTitle>
          <CardDescription>Enter your username</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="realizer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Create Room
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
