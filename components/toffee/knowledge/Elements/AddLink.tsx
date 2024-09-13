import { Plus } from 'lucide-react';
import { RiFileEditLine, RiDeleteBin6Line, MingcuteCheckLine } from "../../icons/Files";
import { CandyLink } from '../Create';
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { MdiInformationOutline } from "../../icons/InformationLine";
import { X } from 'lucide-react';
import { RiLinkM } from '../../icons/Fork';
import Modal from "../../../ui/Modal";
import axios from 'axios';
import Tooltip from '../../../ui/Tooltip';

export interface LinkProps {
  links: CandyLink[] | undefined;
  setLinks: Dispatch<SetStateAction<CandyLink[] | undefined>>;
}

const fetchLinkDetails = async (url: string) => {
  try {
    const response = await axios.get(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    if (response.data.status === 'success') {
      const data = response.data.data;
      return {
        title: data.title,
        image: data.image?.url,
        icon: data.logo?.url,
      };
    } else {
      console.error('Error fetching metadata:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};

const AddLink = ({ links, setLinks }: LinkProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newLink, setNewLink] = useState<CandyLink>({ id: '', title: '', url: '', icon: '', knowledgePackId: '' });

  const [modal, setModal] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [linkPreview, setLinkPreview] = useState<{ title: string; image: string; icon: string } | null>(null);

  const handleAddLink = () => {
    setModal(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    if (links) {
      setNewLink(links[index]);
    }
  };

  const handleEditConfirm = (index: number) => {
    if (!newLink.url || !newLink.title || newLink.url.trim() === '' || newLink.title.trim() === '') {
      handleDelete(index);
      return;
    }

    const updatedLinks = links ? [...links] : [];
    updatedLinks[index] = newLink;
    setLinks(updatedLinks);
    setEditingIndex(null);
    setNewLink({ id: '', title: '', url: '', icon: '', knowledgePackId: '' });
  };

  const handleDelete = (index: number) => {
    if (links) {
      const updatedLinks = links.filter((_, idx) => idx !== index);
      setLinks(updatedLinks);
    }
    setEditingIndex(null); 
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter') {
      handleEditConfirm(index);
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewLink({ id: '', title: '', url: '', icon: '', knowledgePackId: '' });
    setModal(false);
    setLinkPreview(null);
  };

  const handleModalAddLinkConfirm = () => {
    if (linkPreview) {
      const newCandyLink: CandyLink = {
        id: "",
        title: linkPreview.title,
        url: tempUrl,
        icon: linkPreview.icon,
        knowledgePackId: ''
      };

      const updatedLinks = links ? [...links, newCandyLink] : [newCandyLink];
      setLinks(updatedLinks);
      setModal(false);
      setTempUrl('');
      setLinkPreview(null);
    }
  };

  useEffect(() => {
    if (tempUrl) {
      fetchLinkDetails(tempUrl).then((data) => {
        setLinkPreview(data);
      });
    } else {
      setLinkPreview(null);
    }
  }, [tempUrl]);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className='flex flex-row w-full'>
        <span className="text-base font-semibold leading-normal text-white">Add links</span>
        <Plus className='h-6 w-6 text-text-tertiary ml-auto cursor-pointer' onClick={handleAddLink} />
      </div>
      {links && links.map((link, index) => (
        <div key={index} className="flex flex-row gap-3 w-full text-white items-center">
          <div className="flex items-center justify-center">
            <img src={link.icon} alt="Link Icon" className="w-12 h-9 rounded-md"/>
          </div>

          {editingIndex === index ? (
            <>
              <div className="flex flex-col gap-1 flex-grow">
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  onBlur={() => handleEditConfirm(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="text-sm text-text-sub font-medium bg-transparent border-b border-white focus:outline-none"
                  autoFocus
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  onBlur={() => handleEditConfirm(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="text-xs text-text-tertiary bg-transparent border-b border-white focus:outline-none"
                  placeholder="URL"
                />
              </div>
              <div className="flex mt-2 gap-2">
                <MingcuteCheckLine className="h-6 w-6 cursor-pointer" onClick={() => handleEditConfirm(index)} />
                <X onClick={handleCancel} className='cursor-pointer' />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1 flex-grow">
              <span
                className="text-sm text-text-sub font-medium cursor-pointer"
                onClick={() => handleEdit(index)}
              >
                {link.title}
              </span>
              <span className="text-xs text-text-tertiary">{link.url}</span>
            </div>
          )}

          <div className="flex flex-row text-[#777777] gap-6 ml-auto">
            {editingIndex !== index && (
              <>
                <RiFileEditLine className="h-6 w-6 cursor-pointer" onClick={() => handleEdit(index)} />
                <RiDeleteBin6Line className="h-6 w-6 cursor-pointer" onClick={() => handleDelete(index)} />
              </>
            )}
          </div>
        </div>
      ))}
      {(!links || (editingIndex !== null && editingIndex === links.length)) && (
        <div className='flex flex-col w-full items-center justify-center rounded-lg border-dashed border-[1px] py-5 border-white/20 cursor-pointer' onClick={() => setModal(true)}>
          <div className='flex flex-row gap-2'>
            <RiLinkM className='w-5 h-5 text-icon-3' />
            <span className='text-white text-sm font-normal'>{"Add your link"}</span>
          </div>
          <div className='text-sm text-text-tertiary font-light mt-1'>{"Supported links: Youtube, Spotify"}</div>
        </div>
      )}
      <Modal isOpen={modal} onClose={() => false} className="w-full flex-col flex justify-center items-center">
        <div className="bg-bg-2 w-[476px] rounded-xl flex flex-col p-6 gap-6">
          <div className="w-full flex flex-row items-center gap-2">
            <span className="font-normal text-white">Add your link</span>
            <Tooltip text="Add more labels to increase the effectiveness of your knowledge pack" className="bg-[#242424] text-text-tertiary px-4 py-2 rounded-md text-xs w-64 bottom-8 -left-20">
              <MdiInformationOutline className="h-5 w-5 text-[#777777] cursor-pointer" />
            </Tooltip>
            <X className="h-6 w-6 text-[#777777] cursor-pointer ml-auto" onClick={() => setModal(false)} />
          </div>
          {linkPreview && (
            <div className='w-[413px] h-[232px] rounded-lg overflow-hidden'>
              <img src={linkPreview.image} alt="Link Preview" className='w-full h-full object-cover' />
            </div>
          )}
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-text-tertiary'>Your link</span>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="text-sm text-text-sub font-normal bg-transparent border border-white/10 focus:outline-none px-4 py-3 rounded-lg placeholder:text-text-tertiary placeholder:text-[13px]"
              placeholder="Link url"
            />
          </div>
          {/* TODO: Adding label */}
          <div
            className="w-full cursor-pointer bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full text-center text-white px-4 py-1.5 font-normal border border-white/20"
            onClick={handleModalAddLinkConfirm}
          >
            Add link
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddLink;