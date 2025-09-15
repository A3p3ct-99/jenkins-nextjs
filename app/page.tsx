"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRuntimeConfig } from "@/hooks/use-runtime-config";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export default function UserManagement() {
  const {
    config,
    loading: configLoading,
    error: configError,
  } = useRuntimeConfig();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", age: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch users on component mount
  useEffect(() => {
    if (config?.NEXT_PUBLIC_API_URL) {
      fetchUsers();
    }
  }, [config]);

  const fetchUsers = async () => {
    if (!config?.NEXT_PUBLIC_API_URL) {
      toast({
        title: "Error",
        description: "API URL configuration is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${config.NEXT_PUBLIC_API_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data?.payload || data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users. Make sure your API is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleAddUser = async () => {
  //   if (!formData.name || !formData.email || !formData.age) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill in all fields",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setLoading(true)
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/users`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Accept": "application/json"
  //       },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         email: formData.email,
  //         age: parseInt(formData.age),
  //       }),
  //     })

  //     if (response.ok) {
  //       const newUser = await response.json()
  //       setUsers([...users, newUser])
  //       setFormData({ name: "", email: "", age: "" })
  //       setIsAddDialogOpen(false)
  //       toast({
  //         title: "Success",
  //         description: "User added successfully",
  //       })
  //     } else {
  //       throw new Error('Failed to add user')
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to add user. Check your Spring Boot API.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const handleEditUser = async () => {
  //   if (!editingUser || !formData.name || !formData.email || !formData.age) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill in all fields",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setLoading(true)
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/users/${editingUser.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Accept": "application/json"
  //       },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         email: formData.email,
  //         age: parseInt(formData.age),
  //       }),
  //     })

  //     if (response.ok) {
  //       const updatedUser = await response.json()
  //       setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user))
  //       setFormData({ name: "", email: "", age: "" })
  //       setEditingUser(null)
  //       setIsEditDialogOpen(false)
  //       toast({
  //         title: "Success",
  //         description: "User updated successfully",
  //       })
  //     } else {
  //       throw new Error('Failed to update user')
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update user. Check your Spring Boot API.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const handleDeleteUser = async (id: number) => {
  //   if (!confirm('Are you sure you want to delete this user?')) {
  //     return
  //   }

  //   setLoading(true)
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/users/${id}`, {
  //       method: "DELETE",
  //     })

  //     if (response.ok) {
  //       setUsers(users.filter(user => user.id !== id))
  //       toast({
  //         title: "Success",
  //         description: "User deleted successfully",
  //       })
  //     } else {
  //       throw new Error('Failed to delete user')
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete user. Check your Spring Boot API.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const handleSearchByName = async (name: string) => {
  //   if (!name.trim()) {
  //     fetchUsers()
  //     return
  //   }

  //   try {
  //     setLoading(true)
  //     const response = await fetch(`${API_BASE_URL}/users/search?name=${encodeURIComponent(name)}`)
  //     if (response.ok) {
  //       const data = await response.json()
  //       setUsers(data)
  //     } else {
  //       throw new Error('Failed to search users')
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to search users. Using local filter instead.",
  //       variant: "destructive",
  //     })
  //     // Fallback to local filtering if API search fails
  //     const filtered = users.filter(user =>
  //       user.name.toLowerCase().includes(name.toLowerCase())
  //     )
  //     setUsers(filtered)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const openEditDialog = (user: User) => {
  //   setEditingUser(user)
  //   setFormData({
  //     name: user.name,
  //     email: user.email,
  //     age: user.age.toString(),
  //   })
  //   setIsEditDialogOpen(true)
  // }

  // // Local filtering for immediate feedback
  // const filteredUsers = users.filter(user =>
  //   user.name.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  console.log("API_BASE_URL ", config?.NEXT_PUBLIC_API_URL);
  console.log("users ", users);

  // Show loading state while config is loading
  if (configLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-4">Loading configuration...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if config failed to load
  if (configError) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-4 text-red-500">
              Error loading configuration. Please check your environment
              variables.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <CardDescription>
            Manage users with CRUD operations and search functionality
            <br />
            <small>
              API URL: {config?.NEXT_PUBLIC_API_URL || "Not configured"}
            </small>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Optional: Implement debounced API search
                    // handleSearchByName(e.target.value)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={fetchUsers} disabled={loading}>
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      placeholder="Enter age"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    // onClick={handleAddUser}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add User"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          )}

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          // onClick={() => openEditDialog(user)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          // onClick={() => handleDeleteUser(user.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {/* <TableBody>
              
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No users found matching your search." : "No users found. Make sure your Spring Boot API is running and add some users."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.age}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => openEditDialog(user)}
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => handleDeleteUser(user.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}

              </TableBody> */}
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="Enter age"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              // onClick={handleEditUser}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
