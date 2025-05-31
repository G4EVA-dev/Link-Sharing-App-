"use client";
import React, { useState, useEffect } from "react";
import MobileNavBar from "@/components/mobileNavBar";
import TabletNavBar from "@/components/tabletNavBar";
import PhonePreview from "@/components/phoneView";
import { linkService } from "@/services/linkService";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Link, Platform } from "@/types";
import Toast, { ToastType } from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaGripVertical, FaLink } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "react-beautiful-dnd";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

function Page() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false,
    message: "",
    type: "info"
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadLinks();
      }
    }
  }, [user, authLoading, router]);

  const loadLinks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError("");
    try {
      const response = await linkService.getUserLinks(user.id);
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setLinks(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load links");
      showToast(err.message || "Failed to load links", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = () => {
    if (!user) return;

    const newLink: Link = {
      id: `temp-${Date.now()}`,
      platform: "custom",
      url: "",
      userId: user.id,
      order: links.length,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setLinks([...links, newLink]);
  };

  const handleRemoveLink = async (id: string) => {
    if (!user) return;

    try {
      const response = await linkService.removeLink(user.id, id);
      if (response.error) throw new Error(response.error);

      setLinks(links.filter(link => link.id !== id));
      showToast("Link removed successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to remove link", "error");
    }
  };

  const handleSaveLinks = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await linkService.saveLinks(user.id, links);
      if (response.error) throw new Error(response.error);

      showToast("Links saved successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save links", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setLinks(updatedItems);
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <ErrorBoundary>
    <div className="bg-bgColor h-full flex flex-col relative">
      <MobileNavBar />
      <TabletNavBar />
        <main className="p-[16px] lg:flex lg:gap-[24px]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <PhonePreview links={links} isLoading={isLoading} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-[24px] lg:w-full lg:p-[40px] rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-[24px] md:text-[32px] font-bold leading-[36px] md:leading-[48px]">
            Customize your links
          </h1>
                <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px]">
                  Add/edit/remove links below and then share all your profiles with the world!
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            onClick={handleAddLink}
                className="bg-purple text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-buttonHover transition-colors"
              >
                <FaPlus />
                <span>Add new link</span>
              </motion.button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
              >
                {error}
              </motion.div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided: DroppableProvided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    <AnimatePresence>
          {links.map((link, index) => (
                        <Draggable
                          key={link.id}
                          draggableId={link.id}
                          index={index}
                        >
                          {(provided: DraggableProvided) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-4">
                                <div {...provided.dragHandleProps}>
                                  <FaGripVertical className="text-gray-400 cursor-move" />
              </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FaLink className="text-purple" />
                <input
                  type="text"
                  value={link.url}
                                      onChange={(e) => {
                                        const newLinks = [...links];
                                        newLinks[index].url = e.target.value;
                                        setLinks(newLinks);
                                      }}
                                      placeholder="Enter your link"
                                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                    />
                                  </div>
                                  <select
                                    value={link.platform}
                                    onChange={(e) => {
                                      const newLinks = [...links];
                                      newLinks[index].platform = e.target.value as Platform;
                                      setLinks(newLinks);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                  >
                                    <option value="custom">Custom</option>
                                    <option value="github">GitHub</option>
                                    <option value="twitter">Twitter</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="instagram">Instagram</option>
                                  </select>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleRemoveLink(link.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <FaTrash />
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </AnimatePresence>
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="mt-8 p-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveLinks}
                disabled={isSaving}
                className={`w-full bg-purple text-white py-3 rounded-md font-semibold transition-all duration-200 ${
                  isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-buttonHover hover:shadow-custom-shadow'
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="small" />
                    <span>Saving...</span>
              </div>
                ) : (
                  'Save'
                )}
              </motion.button>
            </div>
          </motion.div>
      </main>

        <AnimatePresence>
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          )}
        </AnimatePresence>
    </div>
    </ErrorBoundary>
  );
}

export default Page;
