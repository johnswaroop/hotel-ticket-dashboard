"use client";

import { useState } from "react";
import { Plus, Filter, CalendarIcon, ArrowUpDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Closed";
  createdAt: Date;
  assignedTo: string;
};

type TRange = "1d" | "1w" | "1m" | "all" | "custom";

const priorityConfig = {
  Low: { color: "bg-blue-100 text-blue-800 hover:bg-blue-200", label: "Low" },
  Medium: {
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    label: "Medium",
  },
  High: { color: "bg-red-100 text-red-800 hover:bg-red-200", label: "High" },
};

const statusConfig = {
  Open: {
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    label: "Open",
  },
  "In Progress": {
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    label: "In Progress",
  },
  Closed: {
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    label: "Closed",
  },
};

const placeholderTickets: Ticket[] = [
  {
    id: 1,
    title: "Room 101 AC not working",
    description: "The air conditioning in Room 101 is not cooling properly.",
    priority: "High",
    status: "Open",
    createdAt: new Date(2023, 5, 1, 14, 30),
    assignedTo: "John Doe",
  },
  {
    id: 2,
    title: "Lobby WiFi issues",
    description: "Guests are reporting slow internet speeds in the lobby area.",
    priority: "Medium",
    status: "In Progress",
    createdAt: new Date(2023, 5, 2, 9, 15),
    assignedTo: "Jane Smith",
  },
  {
    id: 3,
    title: "Restock mini bar in Room 205",
    description:
      "The mini bar in Room 205 needs to be restocked with beverages and snacks.",
    priority: "Low",
    status: "Open",
    createdAt: new Date(2023, 5, 3, 11, 45),
    assignedTo: "Mike Johnson",
  },
];

const staffMembers = ["John Doe", "Jane Smith", "Mike Johnson", "Emily Brown"];

export function DashboardComponent() {
  const [tickets, setTickets] = useState<Ticket[]>(placeholderTickets);
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"createdAt" | "priority">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [newTicket, setNewTicket] = useState<Omit<Ticket, "id" | "createdAt">>({
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
    assignedTo: "",
  });

  const [range, setrange] = useState<TRange>("1d");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  const handleAddTicket = () => {
    setTickets([
      ...tickets,
      { ...newTicket, id: tickets.length + 1, createdAt: new Date() },
    ]);
    setNewTicket({
      title: "",
      description: "",
      priority: "Medium",
      status: "Open",
      assignedTo: "",
    });
  };

  const handleUpdateTicket = (
    id: number,
    field: keyof Omit<Ticket, "id" | "createdAt">,
    value: string | number | boolean
  ) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const filteredTickets = tickets
    .filter(
      (ticket) =>
        (filterPriority === "All" || ticket.priority === filterPriority) &&
        (filterStatus === "All" || ticket.status === filterStatus) &&
        (filterAssignedTo === "All" || ticket.assignedTo === filterAssignedTo)
    )
    .sort((a, b) => {
      if (sortBy === "createdAt") {
        return sortOrder === "asc"
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        const priorityOrder = { High: 2, Medium: 1, Low: 0 };
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hotel Helpdesk Dashboard</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Ticket</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newTicket.title}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewTicket({
                      ...newTicket,
                      priority: value as "Low" | "Medium" | "High",
                    })
                  }
                  defaultValue={newTicket.priority}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(
                      ([key, { color, label }]) => (
                        <SelectItem key={key} value={key}>
                          <Badge className={`${color} font-normal`}>
                            {label}
                          </Badge>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignedTo" className="text-right">
                  Assigned To
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewTicket({ ...newTicket, assignedTo: value })
                  }
                  defaultValue={newTicket.assignedTo}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff} value={staff}>
                        {staff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddTicket}>Add Ticket</Button>
          </DialogContent>
        </Dialog>
        <div className="flex mr-auto ml-4 items-center px-4 py-2 gap-2 text-sm border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md">
          <h1>Range</h1>
          <div className="flex gap-1">
            {["1d", "1w", "1m", "all"].map((ele, key) => {
              return (
                <Badge
                  onClick={() => {
                    setrange(ele as TRange);
                  }}
                  className="cursor-pointer uppercase"
                  key={ele + key}
                  variant={range == ele ? "default" : "outline"}
                >
                  {ele}
                </Badge>
              );
            })}
            <Badge className="cursor-pointer" variant={"outline"}>
              <Dialog>
                <DialogTrigger>Custom</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select a Date range</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col mt-4 gap-4">
                        <Label>
                          <p className="mb-2">Start Date</p>
                          <Input
                            value={customDateRange.start}
                            onChange={(e) => {
                              setCustomDateRange((dt) => {
                                dt.start = e.target.value;
                                return { ...dt };
                              });
                            }}
                            type="date"
                          />
                        </Label>
                        <Label>
                          <p className="mb-2">Ending Date</p>
                          <Input
                            value={customDateRange.end}
                            onChange={(e) => {
                              setCustomDateRange((dt) => {
                                dt.end = e.target.value;
                                return { ...dt };
                              });
                            }}
                            type="date"
                          />
                        </Label>
                        <Button
                          onClick={() => {
                            setrange("custom");
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={filterPriority !== "All" ? "bg-secondary" : ""}
              >
                <Filter className="mr-2 h-4 w-4" />
                Priority
                {filterPriority !== "All" && (
                  <Badge
                    variant="secondary"
                    className={"ml-2 bg-primary text-primary-foreground"}
                  >
                    {filterPriority}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterPriority("All")}>
                All
              </DropdownMenuItem>
              {Object.entries(priorityConfig).map(([key, { color, label }]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setFilterPriority(key)}
                >
                  <Badge className={`${color} font-normal`}>{label}</Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={filterStatus !== "All" ? "bg-secondary" : ""}
              >
                <Filter className="mr-2 h-4 w-4" />
                Status
                {filterStatus !== "All" && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-primary text-primary-foreground"
                  >
                    {filterStatus}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("All")}>
                All
              </DropdownMenuItem>
              {Object.entries(statusConfig).map(([key, { color, label }]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setFilterStatus(key)}
                >
                  <Badge className={`${color} font-normal`}>{label}</Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={filterAssignedTo !== "All" ? "bg-secondary" : ""}
              >
                <Filter className="mr-2 h-4 w-4" />
                Assigned To
                {filterAssignedTo !== "All" && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-primary text-primary-foreground"
                  >
                    {filterAssignedTo}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterAssignedTo("All")}>
                All
              </DropdownMenuItem>
              {staffMembers.map((staff) => (
                <DropdownMenuItem
                  key={staff}
                  onClick={() => setFilterAssignedTo(staff)}
                >
                  {staff}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("createdAt");
                  setSortOrder("desc");
                }}
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("createdAt");
                  setSortOrder("asc");
                }}
              >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("priority");
                  setSortOrder("desc");
                }}
              >
                Highest Priority
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("priority");
                  setSortOrder("asc");
                }}
              >
                Lowest Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      handleUpdateTicket(ticket.id, "priority", value)
                    }
                    defaultValue={ticket.priority}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue>
                        <Badge
                          className={`${
                            priorityConfig[ticket.priority].color
                          } font-normal`}
                        >
                          {priorityConfig[ticket.priority].label}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(
                        ([key, { color, label }]) => (
                          <SelectItem key={key} value={key}>
                            <Badge className={`${color} font-normal`}>
                              {label}
                            </Badge>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      handleUpdateTicket(ticket.id, "status", value)
                    }
                    defaultValue={ticket.status}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <Badge
                          className={`${
                            statusConfig[ticket.status].color
                          } font-normal`}
                        >
                          {statusConfig[ticket.status].label}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(
                        ([key, { color, label }]) => (
                          <SelectItem key={key} value={key}>
                            <Badge className={`${color} font-normal`}>
                              {label}
                            </Badge>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      handleUpdateTicket(ticket.id, "assignedTo", value)
                    }
                    defaultValue={ticket.assignedTo}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>{ticket.assignedTo}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-xs">
                        {format(ticket.createdAt, "MM-dd-yy")}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-xs">
                        {format(ticket.createdAt, "p")}
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <CardTitle>{ticket.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{ticket.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Priority</Label>
                  <Select
                    onValueChange={(value) =>
                      handleUpdateTicket(ticket.id, "priority", value)
                    }
                    defaultValue={ticket.priority}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <Badge
                          className={`${
                            priorityConfig[ticket.priority].color
                          } font-normal`}
                        >
                          {priorityConfig[ticket.priority].label}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(
                        ([key, { color, label }]) => (
                          <SelectItem key={key} value={key}>
                            <Badge className={`${color} font-normal`}>
                              {label}
                            </Badge>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    onValueChange={(value) =>
                      handleUpdateTicket(ticket.id, "status", value)
                    }
                    defaultValue={ticket.status}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <Badge
                          className={`${
                            statusConfig[ticket.status].color
                          } font-normal`}
                        >
                          {statusConfig[ticket.status].label}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(
                        ([key, { color, label }]) => (
                          <SelectItem key={key} value={key}>
                            <Badge className={`${color} font-normal`}>
                              {label}
                            </Badge>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Assigned To</Label>
                  <Select
                    onValueChange={(value) =>
                      handleUpdateTicket(ticket.id, "assignedTo", value)
                    }
                    defaultValue={ticket.assignedTo}
                  >
                    <SelectTrigger>
                      <SelectValue>{ticket.assignedTo}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Created At</Label>
                  <div className="flex flex-col items-start mt-1">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {format(ticket.createdAt, "PPP")}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="ml-6 text-sm">
                        {format(ticket.createdAt, "p")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
