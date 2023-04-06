import matplotlib.pyplot as plt
from mpl_toolkits.axes_grid1 import ImageGrid
import numpy as np
import matplotlib.pyplot as plt
import numpy as np
import os
from PIL import Image



#FROM https://kanoki.org/2021/05/11/show-images-in-grid-inside-jupyter-notebook-using-matplotlib-and-numpy/

def img_reshape(img):
    img = Image.open(img).convert('RGBA')
    # img = img.resize((600,600))
    img = np.asarray(img)
    # print(img.shape)
    # plt.imshow(img)
    # plt.show()
    return img

images = os.listdir('screenshots/')
images.sort()
# images.reverse()
print(images)


# for image in images[:3000]:
#     img_arr.append(img_reshape(image))

# pil_im = img_reshape('img4.jpg')
# plt.imshow(np.asarray(pil_im))
num_images=len(images)
h=16
w=16

matrix = [[0 for j in range(w)] for i in range(h)]  # initialize the matrix with zeros

for i in range(h):
    for j in range(w):
        matrix[i][j] = images[i*w + j]
print(matrix)

reversed_matrix = matrix[::-1]
print(reversed_matrix)

reversed_lst = []  # initialize the reversed list

for i in range(h):
    for j in range(w):
        reversed_lst.append(reversed_matrix[i][j])

print(reversed_lst)



print('h x w= total',h,w,h*w)
width=w*300//300
height=h*300//300

print('-----> num images',num_images)

print('creating grid...')

fig, ax0 = plt.subplots(figsize=(50, 50))
ax0.axis('off')
# fig.patch.set_facecolor('black')


grid = ImageGrid(fig, 111, 
                nrows_ncols=(h, w),  # creates 2x2 grid of axes
                axes_pad=0,  # pad between axes
                )

print('done!')

i=0
for ax in grid:
    if i==3000:
        break
    img = Image.open('screenshots/'+reversed_lst[i]).convert('RGBA')
    print(ax,'for image screenshots/'+str(i))
    ax.imshow(img)
    ax.axis('off')
    i+=1
    
plt.subplots_adjust(left=0, right=1, bottom=0, top=1)
# plt.axis('off')
print('saving image...')
plt.savefig('grid_50_reversed.png',transparent=True)
print('done!')
# plt.show()
