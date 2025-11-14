import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate({ from: "/" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("username", username);
    const roomId = Math.random()
      .toString(36)
      .substring(2)
      .split("")
      .map((ch) => (Math.random() < 0.5 ? ch.toUpperCase() : ch))
      .join("");
    navigate({ to: "/room/$roomId", params: { roomId } });
  };
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your chat rom</CardTitle>
          <CardDescription>Enter your username</CardDescription>
          <CardAction>
            <ModeToggle />
          </CardAction>
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
